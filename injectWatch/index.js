// 原因：parcel 没法对文件目录 -> 子目录 进行监听，需要自己生成 cli 
const {join, dirname} = require('path')
const fs = require('fs')
const child_process = require('child_process')
const watch = require('node-watch')

let defultPort = 1234
const parcelRunArg = process.argv[2]
const root = dirname(__dirname)
const injectDir = join(root, '/src/inject')
const watchFileType = ['js', 'ts', 'css', 'less']
// const watchFileType = ['ts', 'css']
// 生成文件系统
const dirArray = []
function generateDirArray(dir){
    dirArray.push(dir)
    fs.readdirSync(dir).forEach((file)=>{
        const filePath = join(dir, file)
        // 是否为目录
        if(fs.statSync(filePath).isDirectory()){
            generateDirArray(filePath)
        }
    })
}
generateDirArray(injectDir)

/**
 * 生成 [npx parcel ... F:\\chrome-test\\chrome-extensions-template\\src\\inject\\*.ts --dist-dir F:\\chrome-test\\chrome-extensions-template\\dist\\inject\\]
 * 
 * */ 
const commandArray = dirArray.reduce((prev, dirPath)=>{
    defultPort+=1
    const enterPath = watchFileType.reduce((prev, type)=>{
            prev += ` ${dirPath}\\*.${type}`
            return prev
        }, '')
    const addparcelHmrPort = parcelRunArg === 'watch' ? `--hmr-port ${defultPort}` : ''
    const distPath = dirPath.replace('src', 'dist')
    const after = enterPath + ` --dist-dir ${distPath} ${addparcelHmrPort}`
    const command = `npx parcel ${parcelRunArg}` + after
    prev.push(command.replace(/\\/g, '\\\\'))
    return prev
},[])

// console.log(commandArray)
// watch(injectDir, {
//     recursive: true
// }).on('change', function(evt, path){
//     if(path.includes('.')){
//         // 如果是目录
        
//     }
// })

commandArray.forEach((command)=>{
    console.log(command)
    const processExec = child_process.exec(`${command}`, {})
    processExec.stdout.on('data', data=>{
        console.log(data.toString())
    })
    processExec.stderr.on('data', data=>{
        console.log(data.toString())
    })
})
