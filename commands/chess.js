const { Chess } = require('chess.js');


const Board = new Map();

module.exports = {
    name: 'chess',
    aliases: ['start','join', 'move', 'restart', 'quit', 'resign','flip'],
    description: "This command will start a game of chess",
    async execute(message, args, cmd, client, Discord){
        try {        
            const memberMessageEmbed = new Discord.MessageEmbed().setDescription("Starting!");
            //    .setAuthor(client.user.tag);
            
            let player_board = Board.get(message.author.id);
            if (!isNaN(player_board)){
                player_board = Board.get(player_board);
            }

            if(cmd === 'start'){
                let chess = new Chess();
                let text = "";
                
                if(!player_board) {
                    
                    const thread = await message.channel.threads.create({
                        name: 'Chess Battle '+ message.author.tag,
                        autoArchiveDuration: 1440,
                        reason: 'Needed a separate thread for chess game',
                    });
                    const board_constructor = {
                        player_1 : {user: message.author, turn : 'w' } ,
                        player_2 : {user: message.author, turn : 'b'},
                        chess : chess,
                        text : text,
                        room : false,
                        thread : thread,
                        channel : message.channel
                    }
                    Board.set(message.author.id, board_constructor);
                    
                    
                    message.channel.send("You have start a game!");
                    boardUpdate(board_constructor.thread,board_constructor,memberMessageEmbed, true);
                    boardUpdate(board_constructor.channel,board_constructor, memberMessageEmbed, null); 
                } else {
                    message.channel.send("You have start a game!");
                }
            }

            if(cmd === 'move'){
                if(!player_board) {
                    message.channel.send('You have not start a game. Use "&start" command to start a new game!');
                } else if ((message.author === player_board.player_1.user && player_board.chess.turn() === player_board.player_1.turn)||(message.author === player_board.player_2.user && player_board.chess.turn() === player_board.player_2.turn)){
                    if (args.length === 1){
                        if(player_board.chess.move(args[0])){
                            await boardUpdate(player_board.thread,player_board,memberMessageEmbed, true);
                            await boardUpdate(player_board.channel,player_board,memberMessageEmbed, null);
                            console.log(player_board.chess.moves());
                        }
                        else {
                            message.channel.send("The move is not legal!");
                        }
                    } else if (args.length === 3 && args[1] === 'to') {
                        let moveFromTo = {from : args[0], to : args[2]};
                        if(player_board.chess.move(moveFromTo)){
                            await boardUpdate(player_board.thread,player_board,memberMessageEmbed, true);
                            await boardUpdate(player_board.channel,player_board,memberMessageEmbed, null);
                            console.log(player_board.chess.moves());
                        }
                        else {
                            message.channel.send("The move is not legal!");
                        }
                    }
                    if (player_board.chess.game_over()) {
                        if (player_board.player_1.user === player_board.player_2.user){
                            Board.delete(message.author.id);
        
                        } else {
                            Board.delete(player_board.player_2.user.id);
                            Board.delete(message.author.id);
                        }
                        
                        return message.channel.send({
                            embeds : [memberMessageEmbed
                                .setTitle(`Chess Battle`)
                                .setDescription("**" + message.author.tag + "**\n Won the game!" )]                        
                        }); 
                    }         
                } 
                else {
                    message.channel.send("it's not your turn yet!");
                }

            }

            if(cmd === 'restart'){
                
                if(!player_board) {
                    message.channel.send('You have not start a game. Use "&start" command to start a new game!');
                } else {
                    player_board.chess.reset();
                    boardUpdate(player_board.thread,player_board,memberMessageEmbed, true);
                    boardUpdate(player_board.channel,player_board,memberMessageEmbed, null);
                                
                }
            }
            
            if(cmd === 'join'){
                if (!args.length) return message.channel.send("Mention the player to join their game in the argument.");
                
                let player_1 = client.users.cache.get(getUserFromMention(args[0]));
                
                if (player_1 === message.author) return message.channel.send('You want to play alone? :(');
                
                let otherPlayerBoard = Board.get(player_1.id);
                

                //const permissionMessage = await message.channel.send(message.author.tag +" would like to join "+ player_1.tag +"'s game. Do "+player_1.tag+ " accept?");
                if (otherPlayerBoard) {
                    if (otherPlayerBoard.room) return message.channel.send("The game you want to join is full");   
                    message.react('🇾').then(() => message.react('🇳'));
                    client.on('messageReactionAdd', async (reaction, user) => {
                        if (reaction.message.partial) await reaction.message.fetch();
                        if (reaction.partial) await reaction.fetch();
                        if (user.bot) return;
                        if (!reaction.message.guild) return;
            
                        if (user.id === player_1.id) {
                            if (reaction.emoji.name === '🇾') {
                                otherPlayerBoard.player_2.user = message.author;
                                otherPlayerBoard.room = true;
                                Board.set(message.author.id, player_1.id);
                                console.log(otherPlayerBoard);

                                return message.channel.send( player_1.tag + " accepted your request to join.");
                            }
                            if (reaction.emoji.name === '🇳') {
                                return message.channel.send( player_1.tag + " declined your request to join.");
                            }
                        } else {
                            message.channel.send("Who are you?")
                        }
                    });
                } else {
                    message.channel.send("The game you want to join doesn't exist.");
                }
        
            }

            if(cmd === 'quit' || cmd === 'resign'){
                if(player_board) {
                    if (player_board.player_1.user === player_board.player_2.user){
                        Board.delete(message.author.id);
                        await player_board.thread.delete();
                        return winnerUpdate(message, message.author, memberMessageEmbed);
                        

                    } else {

                        Board.delete(player_board.player_2.user.id);
                        Board.delete(message.author.id);
                        await player_board.thread.delete();
                        if (message.author === player_board.player_1.user){
                            return winnerUpdate(message, player_board.player_2.user, memberMessageEmbed);
                        } else {
                            return winnerUpdate(message, player_board.player_1.user, memberMessageEmbed);
                        }
                    }
                }
            }
            
            if(cmd === 'flip'){
                boardUpdate(message.channel,player_board,memberMessageEmbed, true);
            }
        } catch{
            console.error;
            message.channel.send({embeds : [memberMessageEmbed
                .setTitle("There's something wrong")
                .setDescription("This message will be deleted in 10 seconds.")
                ]}).then(msg => {setTimeout(() => msg.delete(), 10000)})
        }
    }
}

const winnerUpdate = (message, user, memberMessageEmbed) => {
    return message.channel.send({
        embeds : [memberMessageEmbed
            .setTitle(`Chess Battle`)
            .setDescription("**" + user.tag + "**\n Won the game!")]
    })
}

const boardUpdate = (channel, player_board, memberMessageEmbed, flip) => {
    player_board.text = "";
    if ((player_board.chess.turn() === 'b' && flip === null) || (player_board.chess.turn() === 'w' && flip)){
        return channel.send({
            embeds : [memberMessageEmbed
                .setTitle(`Chess Battle`)
                .setDescription("**"+ player_board.player_1.user.tag + "** (yellow)\n" + renderBoard(player_board.chess,player_board.text,flip)+ "\n**"+ player_board.player_2.user.tag + "** (green)")
            ]
        }) 
    }  
    return channel.send({
        embeds : [memberMessageEmbed
            .setTitle(`Chess Battle`)
            .setDescription("**"+ player_board.player_2.user.tag + "** (green)\n" + renderBoard(player_board.chess,player_board.text,flip)+ "\n**"+ player_board.player_1.user.tag + "** (yellow)")]
    })
}

function renderBoard(chess,text, flip){
    let reversedChess = chess.board().slice().reverse();

    if ((chess.turn() === 'b' && flip === null) || (chess.turn() === 'w' && flip) ){
        for (let i = 0; i < reversedChess.length; i++) {
            // get the size of the inner array
            var innerArrayLength = reversedChess[i].length;
            // loop the inner array
            for (let j = 0; j < innerArrayLength; j++) {
                text = flippedtranslating(reversedChess[i][j],i,j,text);
            }
        }
    } else {
        for (let i = 0; i < chess.board().length; i++) {
            // get the size of the inner array
            var innerArrayLength = chess.board()[i].length;
            // loop the inner array
            for (let j = 0; j < innerArrayLength; j++) {
                text = translating(chess.board()[i][j],i,j,text);
            }
        }
    }
    text += ":black_large_square::regional_indicator_a::regional_indicator_b::regional_indicator_c::regional_indicator_d::regional_indicator_e::regional_indicator_f::regional_indicator_g::regional_indicator_h:";
    return text;
}

const BoardIndex = ["one", "two", "three", "four","five","six","seven","eight"];
const flippedBoardIndex = BoardIndex.slice().reverse();

function translating(value, index1, index2, text){
    if(index2 === 0){
        text += ":"+flippedBoardIndex[index1]+":";
    }
    if(value === null){
        if((index1) % 2 === 1 && (index2) % 2 === 1 ||(index1) % 2 === 0 && (index2) % 2 === 0){
            text += ":white_large_square:";
        } else {
            text += ":black_large_square:";
        }
    } else {
        switch(value.color){
            case 'w':
                
                switch(value.type){
                    case 'p':
                        text += ":icecream:";
                        break;
                    case 'r':
                        text += ":sandwich:";
                        break;
                    case 'n':
                        text += ":baby_chick:";
                        break;
                    case 'b':
                        text += ":french_bread:";
                        break;
                    case 'q':
                        text += ":bread:";
                        break;
                    case 'k':
                        text += ":onion:";
                }
            break;
            
            case 'b':
                switch(value.type){
                    case 'p':
                        text += ":shamrock:";
                        break;
                    case 'r':
                        text += ":canned_food:";
                        break;
                    case 'n':
                        text += ":t_rex:";
                        break;
                    case 'b':
                        text += ":cucumber:";
                        break;
                    case 'q':
                        text += ":bell_pepper:";
                        break;
                    case 'k':
                        text += ":melon:";
                    }    
                }
            }
            
    if(index2 === 7) {
            text += "\n";
    }

    return text;
}
function flippedtranslating(value, index1, index2, text){
    if(index2 === 0){
        text += ":"+ BoardIndex[index1]+":";
    }
    if(value === null){
        if((index1) % 2 === 1 && (index2) % 2 === 1 ||(index1) % 2 === 0 && (index2) % 2 === 0){
            text += ":black_large_square:";
        } else {
            text += ":white_large_square:";
        }
    } else {
        switch(value.color){
            case 'w':
                
                switch(value.type){
                    case 'p':
                        text += ":icecream:";
                        break;
                    case 'r':
                        text += ":sandwich:";
                        break;
                    case 'n':
                        text += ":baby_chick:";
                        break;
                    case 'b':
                        text += ":french_bread:";
                        break;
                    case 'q':
                        text += ":bread:";
                        break;
                    case 'k':
                        text += ":onion:";
                }
            break;
            
            case 'b':
                switch(value.type){
                    case 'p':
                        text += ":shamrock:";
                        break;
                    case 'r':
                        text += ":canned_food:";
                        break;
                    case 'n':
                        text += ":t_rex:";
                        break;
                    case 'b':
                        text += ":cucumber:";
                        break;
                    case 'q':
                        text += ":bell_pepper:";
                        break;
                    case 'k':
                        text += ":melon:";
                    }    
                }
            }
            
    if(index2 === 7) {
            text += "\n";
    }

    return text;
}

function getUserFromMention(mention) {
    if (!mention) return;

    if (mention.startsWith('<@') && mention.endsWith('>')) {
        mention = mention.slice(2, -1);

        if (mention.startsWith('!')) {
            mention = mention.slice(1);
        }

        return mention;
    }
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}