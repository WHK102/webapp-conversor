import React from 'react';
import Str   from './Strings.json';


class MainFragment extends React.Component{

    constructor(props) {
        super(props);

        // Dependencies
        this.CryptoJS = require("crypto-js");

        // Default values for this context state
        this.state = {
            inputAlgorithm  : 'ascii',
            outputAlgorithm : 'base64',
            inputContent    : '',
            outputValue     : ''
        };

        // Hook events
        this.onChangeInputContent    = this.onChangeInputContent.bind(this);
        this.onChangeInputAlgorithm  = this.onChangeInputAlgorithm.bind(this);
        this.onChangeOutputAlgorithm = this.onChangeOutputAlgorithm.bind(this);

        // Chose language
        this.str = Str.es;
    }

    onChangeInputAlgorithm(event){
        this.setState({inputAlgorithm: event.target.value}, function(){
            this.computeOutput();
        });
    }

    onChangeOutputAlgorithm(event){
        this.setState({outputAlgorithm: event.target.value}, function(){
            this.computeOutput();
        });
    }

    onChangeInputContent(event){
        this.setState({inputContent: event.target.value}, function(){
            this.computeOutput();
        });
    }

    computeOutput(){
        var input  = '';
        var output = '';

        if(this.state.inputAlgorithm === 'ascii'){
            // Direct ascii
            input = this.state.inputContent;

        }else if(this.state.inputAlgorithm === 'base64'){
            input = this.CryptoJS.enc.Base64
                .parse(this.state.inputContent)
                .toString(this.CryptoJS.enc.Latin1)

        }else if(this.state.inputAlgorithm === 'hexadecimal'){
            let validHexString = this.state.inputContent
                    .replace(/[^0-9a-f]/gi, '')
                    .match(/[\w]{2}/g);

            if(validHexString){
                input = this.CryptoJS.enc.Hex
                    .parse(validHexString.join(''))
                    .toString(this.CryptoJS.enc.Latin1);
            }

        }else if(this.state.inputAlgorithm === 'decimal'){
            let str = this.state.inputContent.replace(/\s+/g, ' ').trim();
            str = str.replace(/[^0-9 +]/g, '');
            let values = str.match(/\d+/g) || [];
            for(let i = 0; i < values.length; i++) {
                input += String.fromCharCode(values[i]);
            }

        }else if(this.state.inputAlgorithm === 'octal'){
            let str = this.state.inputContent.replace(/\s+/g, ' ').trim();
            str = str.replace(/[^0-9 +]/g, '');
            let values = str.match(/\d+/g) || [];
            for(let i = 0; i < values.length; i++) {
                input += String.fromCharCode(parseInt(values[i], 8));
            }

        }else if(this.state.inputAlgorithm === 'htmlentity'){
            // ...
            input = '[soon]';

        }else if(this.state.inputAlgorithm === 'urlencode'){
            input = unescape(this.state.inputContent);
        }

        if(this.state.outputAlgorithm === 'ascii'){
            output = input; // Direct ascii

        }else if(this.state.outputAlgorithm === 'base64'){
            output = this.CryptoJS.enc.Latin1
                    .parse(input)
                    .toString(this.CryptoJS.enc.Base64);

        }else if(this.state.outputAlgorithm === 'hexadecimal'){
            output = this.CryptoJS.enc.Latin1
                    .parse(input)
                    .toString(this.CryptoJS.enc.Hex);

        }else if(this.state.outputAlgorithm === 'hexadecimal-prefix-x'){
            if(input){
                output = '\\x' + (this.CryptoJS.enc.Hex.stringify(
                    this.CryptoJS.enc.Latin1.parse(input)
                ) + '').match(/[\w]{2}/g).join('\\x');
            }

        }else if(this.state.outputAlgorithm === 'decimal'){
            if(input){
                let dec = '';
                for(let i=0; i < input.length; i++) {
                    dec += input.charCodeAt(i) + ' ';
                }
                output = dec.trim();
            }

        }else if(this.state.outputAlgorithm === 'octal'){
            if(input){
                let dec = '';
                for(let i=0; i < input.length; i++) {
                    dec += input.charCodeAt(i).toString(8) + ' ';
                }
                output = dec.trim();
            }

        }else if(this.state.outputAlgorithm === 'htmlentity'){
            if(input){
                let dec = '';
                for(let i=0; i < input.length; i++) {
                    dec += '&#' + input.charCodeAt(i) + ';';
                }
                output = dec.trim();
            }

        }else if(this.state.outputAlgorithm === 'urlencode'){
            if(input){
                output = '%' + (this.CryptoJS.enc.Hex.stringify(
                    this.CryptoJS.enc.Latin1.parse(input)
                ) + '').match(/[\w]{2}/g).join('%');
            }

        }else if(this.state.outputAlgorithm === 'md5'){
            output = this.CryptoJS.MD5(
                this.CryptoJS.enc.Latin1.parse(this.state.inputContent)
            ).toString();

        }else if(this.state.outputAlgorithm === 'sha1'){
            output = this.CryptoJS.SHA1(
                this.CryptoJS.enc.Latin1.parse(this.state.inputContent)
            ).toString();

        }else if(this.state.outputAlgorithm === 'sha256'){
            output = this.CryptoJS.SHA256(
                this.CryptoJS.enc.Latin1.parse(this.state.inputContent)
            ).toString();

        }else if(this.state.outputAlgorithm === 'sha512'){
            output = this.CryptoJS.SHA512(
                this.CryptoJS.enc.Latin1.parse(this.state.inputContent)
            ).toString();
        }

        // Final output
        this.setState({outputValue: output});
    }

    render(){
        return (
            <div className="MainFragment">
                <div className="card">
                    <div className="card-body">

                        <form>
                            <div className="row">
                                <div className="col-md-6 col-xs-12">
                                    <div className="form-group">
                                        <label htmlFor="form-alginput">{this.str.inputAlgorithm}</label>
                                        <span className="form-select">
                                            <select
                                                defaultValue="ascii"
                                                onChange={this.onChangeInputAlgorithm}
                                                className="form-control">
                                                <optgroup label={this.str.algorithmTwoway}>
                                                    <option value="ascii">{this.str.algorithmAscii}</option>
                                                    <option value="base64">{this.str.algorithmBase64}</option>
                                                    <option value="hexadecimal">{this.str.algorithmHex}</option>
                                                    <option value="decimal">{this.str.algorithmDec}</option>
                                                    <option value="octal">{this.str.algorithmOct}</option>
                                                    <option value="htmlentity">{this.str.algorithmHtmlentity}</option>
                                                    <option value="urlencode">{this.str.algorithmUrlencode}</option>
                                                </optgroup>
                                            </select>
                                        </span>
                                    </div>
                                </div>
                                <div className="col-md-6 col-xs-12">
                                    <div className="form-group">
                                        <label htmlFor="form-algoutput">{this.str.outputAlgorithm}</label>
                                        <select
                                            defaultValue="base64"
                                            onChange={this.onChangeOutputAlgorithm}
                                            className="form-control">
                                            <optgroup label={this.str.algorithmTwoway}>
                                                <option value="ascii">{this.str.algorithmAscii}</option>
                                                <option value="base64">{this.str.algorithmBase64}</option>
                                                <option value="hexadecimal">{this.str.algorithmHex}</option>
                                                <option value="hexadecimal-prefix-x">{this.str.algorithmHexPrefixX}</option>
                                                <option value="decimal">{this.str.algorithmDec}</option>
                                                <option value="octal">{this.str.algorithmOct}</option>
                                                <option value="htmlentity">{this.str.algorithmHtmlentity}</option>
                                                <option value="urlencode">{this.str.algorithmUrlencode}</option>
                                            </optgroup>
                                            <optgroup label={this.str.algorithmOneway}>
                                                <option value="md5">{this.str.algorithmMd5}</option>
                                                <option value="sha1">{this.str.algorithmSha1}</option>
                                                <option value="sha256">{this.str.algorithmSha256}</option>
                                                <option value="sha512">{this.str.algorithmSha512}</option>
                                            </optgroup>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        
                            <div className="row">
                                <div className="form-group col-lg-6 col-md-12">
                                    <label htmlFor="form-input">{this.str.inputContent}</label>
                                    <textarea
                                        onChange={this.onChangeInputContent}
                                        autoCorrect="off"
                                        autoCapitalize="off"
                                        spellCheck="false"
                                        rows="8"
                                        className="form-control text-monospace"></textarea>
                                </div>
                                <div className="form-group col-lg-6 col-md-12">
                                    <label htmlFor="form-output">{this.str.outputContent}</label>
                                    <textarea
                                        value={this.state.outputValue}
                                        readOnly
                                        autoCorrect="off"
                                        autoCapitalize="off"
                                        spellCheck="false"
                                        rows="8"
                                        className="form-control text-monospace"></textarea>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default MainFragment;