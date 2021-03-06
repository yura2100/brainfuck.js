const path = require('path');
const fs = require('fs');
const readline = require('readline');

//Creates readline interface in order to input data into the terminal
const rl = readline.createInterface({
   input: process.stdin,
   output: process.stdout
});

//Finds file with .b or .bf extention, which are in the same dir as index.js
const fileName = fs.readdirSync(__dirname).find(element => {
    if(path.extname(element) === '.b' || path.extname(element) === '.bf'){
        return true;
    }
});

//Creates file path
const filePath = path.join(__dirname, fileName);

//Gets file content and splits it in an array
const tokens = fs.readFileSync(filePath).toString().split('');

//Makes request for users input
const request = new Promise(resolve => {
    rl.question('', async answer => {
        const res = answer.charCodeAt(0);
        rl.close();
        resolve(res);
    });
});

const main = async () => {
    //Creates pointer and 30000 memory cells, which all are equal to 0
    let j = 0;
    let brc = 0;
    const arr = new Int8Array(30000).fill(0);

    //Interpretaion of brainfuck
    for(let i = 0; i < tokens.length; i++){
        switch (tokens[i]) {
            case '>':
                j++;
                break;
            case '<':
                j--;
                break;
            case '+':
                arr[j]++;
                break;
            case '-':
                arr[j]--;
                break;
            case '.':
                console.log(String.fromCharCode(arr[j]));
                break;
            case ',':
                arr[j] = await request.then(res => res);
                break;
            case '[':
                if(!arr[j]){
                    brc++;
                    while(brc){
                        i++;
                        if(tokens[i] === '[')
                            brc++;
                        if(tokens[i] === ']')
                            brc--;
                    }
                }else
                    continue;
                break;
            case ']':
                if(!arr[j])
                    continue;
                else{
                    if (tokens[i] === ']')
                        brc++;
                    while (brc){
                        i--;
                        if (tokens[i] === '[')
                            brc--;
                        if (tokens[i] === ']')
                            brc++;
                    }
                    i--;
                }
                break;
            default:
                break;
        }
    }
};

main().then(() => process.exit(0));
