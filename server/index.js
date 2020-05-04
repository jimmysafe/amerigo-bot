require('dotenv').config()
const Discord = require('discord.js');
const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const fs = require('fs')
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffmpeg = require ('fluent-ffmpeg')
const ytdl = require('ytdl-core')
const moment = require('moment');

const app = express()
const client = new Discord.Client();

const port = 9000

// Middlewares
app.use(cors())
app.use(fileUpload())
app.use(express.static('uploads'))
app.use(express.json())


client.once('ready', () => {
    console.log("BOT READY")
});

client.on('message', async msg => {
    if (!msg.guild) return;

    const evaluateGuildDir = () => {
        let guildDir = `${__dirname}/uploads/${msg.guild.id}`
        if (!fs.existsSync(guildDir)){
            fs.mkdirSync(`${guildDir}`);
            console.log('created guild dir')
        }
        else console.log("guild directory exists")
    }

    if(msg.content === '-a reset'){
        await msg.member.voice.channel.leave()
    }

    if(msg.content === '-a info'){
        evaluateGuildDir()
        await msg.member.voice.channel.join();
        //msg.reply(`Load your audios here: https://amerigo.netlify.com/${msg.guild.id}`)
    }

    if(msg.content === '-a shuffle'){
        evaluateGuildDir()
        const connection = await msg.member.voice.channel.join();
        const dir = `${__dirname}/uploads/${msg.guild.id}`
        fs.readdir(dir, (err, files) => {
            const randomItem = files[Math.floor(Math.random()*files.length)];
            connection.play(`${dir}/${randomItem}`, {
                volume: 0.5,
            })
            msg.reply("Playing Random, " + randomItem)
        });
    }

    if (msg.content === '-a last'){
        evaluateGuildDir()
        const connection = await msg.member.voice.channel.join();
        const dir = `${__dirname}/uploads/${msg.guild.id}/`
        fs.readdir(dir, (err, files) => {
            if(err) console.log(err)
            files.sort((a, b) => {
                return fs.statSync(dir + a).mtime.getTime() - 
                       fs.statSync(dir + b).mtime.getTime();
            });
            const lastFile = files[files.length - 1];
            connection.play(`${dir}${lastFile}`, {
                volume: 0.5,
            })
            msg.reply("Playing Last Added, " + lastFile)
        });
    }

    if(msg.content === '-a commands'){
        evaluateGuildDir()
        let allCommands = [
            { name: "BASIC COMMANDS", value: "--------" },
            { name: '-a info', value: "Displays the web url where you can upload your audios"},
            { name: "-a shuffle", value: "Randomly select and plays a audio from your audios" },
            { name: '-a last', value: "Select and plays the last added audio" },
            { name: 'FILE COMMANDS', value: "--------" },
            { name: '-a <FILE AUDIO NAME HERE>', value: "Replace <FILE AUDIO NAME HERE> with the name of your audio and Amerigo will start playing that specific audio!" },
        ]
        const commandsEmbed = new Discord.MessageEmbed()
        .setColor('#f88eb7')
        .setTitle("Amerigos's Commands")
        .setDescription('List all usable commands')
        .setThumbnail('https://user-images.githubusercontent.com/12184812/77235455-aa5da700-6bad-11ea-95cb-e66316380163.png')
        .addFields(allCommands)

        msg.channel.send(commandsEmbed)
    }

    fs.readdir(`${__dirname}/uploads/${msg.guild.id}`, (err, files) => {
        if(files && files.length > 0){
            files.forEach(async el => {
                let f = el.split('.')
                let fileName = f[0]
                if(msg.content === `-a ${fileName}`){
                    const connection = await msg.member.voice.channel.join();
                    const dir = `${__dirname}/uploads/${msg.guild.id}`
                    connection.play(`${dir}/${fileName}.mp3`, {
                        volume: 0.5,
                    })
                    msg.reply("Playing, " + fileName)
                }
            })
        }
    })

})

app.get('/api', (req, res) => {
    res.send("it works!")
})

app.post('/youtube', async(req, res) => {
    const { guildId, fileName, url, startTime, endTime } = req.body
    const mp3 = `./uploads/${guildId}/${fileName}.mp3`
    const stream = ytdl(url)
   
    let start = moment(startTime, "HH:mm:ss")
    let end = moment(endTime, "HH:mm:ss")

    let formattedDuration = moment.utc(end.diff(start)).format("HH:mm:ss")

    let duration = moment(formattedDuration, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds');

    const proc = new ffmpeg({ source:stream })
    proc.setFfmpegPath(ffmpegInstaller.path)
    proc.setStartTime(startTime)
    proc.setDuration(duration)
    proc.on('error', err => console.log(err))
    proc.on('end', () => {
        res.send("success")
    });
    proc.saveToFile(mp3)
})

app.post('/admin', async(req, res) => {
    try {
        const { id } = req.body
        let fileDir = `${__dirname}/uploads/${id}`
        fs.readdir(fileDir, (err, files) => {
            let formattedFiles = []
            files.forEach(file => {
                let created_at = moment(fs.statSync(`${fileDir}/${file}`).ctime).format('D MMM Y - HH:mm:ss')
                let f = file.split('.')
                formattedFiles.push({ name: f[0], created_at  })
            })
            res.json(formattedFiles)
        })
    } catch(err) {
        res.send({ error: true, msg: err })
    }
})

app.post('/delete', (req, res) => {
    const { fileName, id } = req.body
    fs.unlinkSync(`${__dirname}/uploads/${id}/${fileName}.mp3`)
    res.send("success delete")
})

app.post('/rename', (req, res) => {
    const { newName, prevName, id } = req.body
    fs.rename(
        `${__dirname}/uploads/${id}/${prevName}.mp3`, 
        `${__dirname}/uploads/${id}/${newName}.mp3`,
        (err) => {
            if(err) res.send("error")
            else res.send('success update')
        })
})

client.login(process.env.BOT_TOKEN);
app.listen(port, () => console.log(`Ready on port ${port}`))
