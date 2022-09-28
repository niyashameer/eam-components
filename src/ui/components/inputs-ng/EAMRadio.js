import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import EAMBaseInput from './components/EAMBaseInput';
import { areEqual } from './tools/input-tools';

const EAMRadio = (props) => {

    const { values, value, onChange, id } = props;

    const generateRadioButtons = (values) => {
        if (values) {
            return values.map(value => (
                <FormControlLabel key={value.code} value={value.code} control={<Radio color="primary"/>}
                                  label={value.desc}/>
            ));
        }
    };

    const onChangeHandler = (event) => {
        onChange(event.target.value)
    }

    return (
        <EAMBaseInput {...props}>
            <RadioGroup
                aria-label={id}
                name={id}
                value={value || ''}
                onChange={onChangeHandler}
                style={{flexDirection: 'row'}}>
                {generateRadioButtons(values)}
            </RadioGroup>
        </EAMBaseInput>)
}

export default React.memo(EAMRadio, areEqual);