export default class Recognizer{

    constructor(dict){
        this.transcript = "";

        this.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
        this.SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

        this.dict = dict;
        this.listen = false;

        var arr = [];

        for(let a in this.dict){
            for(let b of this.dict[a]){
                arr.push(b);
            }
        }
       
        this.grammar = '#JSGF V1.0; grammar colors; public <color> = ' + arr.join(' | ') + ' ;'

        this.recognition = new this.SpeechRecognition();
        this.speechRecognitionList = new this.SpeechGrammarList();
        this.speechRecognitionList.addFromString(this.grammar, 1);


        this.recognition.grammars = this.speechRecognitionList;
        this.recognition.lang = 'en-US';
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 3;

        this.recognition.onresult = event =>{
            var last = event.results.length - 1;
            
            for(let t of event.results[last]){
                this.transcript += " " + t.transcript;  
            }
            console.log(this.transcript);
            
            // if(event.results[last].isFinal){
            //     this.transcript = "";
            // }
    
        }

        this.recognition.onend = event =>{
        }
        
        this.recognition.onnomatch = function(event) {
            console.log("No color detected.")
        }
        
        this.recognition.onerror = function(event) {
            console.log('Error occurred in recognition: ' + event.error);
        }
    }

    getTranscript(){
        return this.transcript;
    }

    clear(bo){
        this.transcript = "";
        return bo;
    }

    equals(string){
        // console.log(this.getTranscript());

        for(let a of this.dict[string]){
            if(this.transcript.toLowerCase().split(" ").includes(a.toLowerCase())){

                return this.clear(true);
            } 
        }

        // console.log(string + " => " + this.transcript.toLowerCase());
        
        return this.clear(false);
    }

    start(){
        this.recognition.start();
    }

    stop(){
        this.recognition.stop();
    }

    abort(){
        this.recognition.abort();

    }
}
