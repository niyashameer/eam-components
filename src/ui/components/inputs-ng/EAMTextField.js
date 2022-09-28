import React, {useState, useEffect} from 'react';
import {areEqual} from './tools/input-tools'
import EAMBaseInput from './components/EAMBaseInput';
import TextField from './components/TextField';

const EAMTextField = (props) => {

    const {value, onChange, onChangeInput} = props;
    const [inputValue, setInputValue] = useState(value || '');

    useEffect(() => setInputValue(value || ''), [value]);

    // TODO: to be reviewed
    const inputProps = {
        onChange: (event) => {
            setInputValue(event.target.value);
            onChangeInput?.(event.target.value);
        },
        onBlur: () => {
            if (inputValue !== value) {
                onChange(inputValue);
            }
        },
        value: inputValue,
    };

    return (
        <EAMBaseInput {...props}>
            <TextField {...props} inputProps = {inputProps} />
        </EAMBaseInput>
    )

}

export default React.memo(EAMTextField, areEqual);