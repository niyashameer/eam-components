import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import useFetchAutocompleteOptions from './hooks/useFetchAutocompleteOptions';
import {areEqual, componentsProps, renderOptionHandler, updateCodeDesc} from './tools/input-tools'
import EAMBaseInput from './components/EAMBaseInput';
import TextField from './components/TextField';
import { saveHistory, HISTORY_ID_PREFIX } from './tools/history-tools';

const EAMAutocomplete = (props) => {
   
  let {autocompleteHandler, autocompleteHandlerParams, 
       value, desc, id, renderValue, onChange} = props;

    let [inputValue, setInputValue] = useState("")
    let [open, setOpen] = useState(false)
    let [fetchedOptions, loading] = useFetchAutocompleteOptions(autocompleteHandler, autocompleteHandlerParams, inputValue, value, open, id)
  
    const getOptionLabelHandler = option => {
        return option.code ?? option;
    }

    const onInputChangeHandler = (event, newInputValue) => {
     setInputValue(newInputValue);
     if (newInputValue !== value && desc) {
      onChange({desc: ''})
     }
    }

    const onChangeHandler = (event, newValue, reason) => {
      if (reason === 'clear' || reason === 'createOption') {
        // Cases handled by the onCloseHandler 
        return;
      }
      
      saveHistory(HISTORY_ID_PREFIX + id, newValue.code, newValue.desc)

      onChange(newValue);

      // Don't bubble up any events (won't trigger a save when we select something by pressing enter)
      event.stopPropagation();
      event.preventDefault();
    }


    const onCloseHandler = (event, reason) => {
      setOpen(false)
      // Only to be fired when we blur, press ESC or hit enter and the inputValue is different than the original value
      if ( (reason === 'blur' || reason === 'escape' || reason === 'createOption') && inputValue !== value) {
          // TODO: validation if inputValue is not empty 
          onChange({code: inputValue})
      } 
    }

    return (
      <EAMBaseInput {...props}>
          <Autocomplete   
            // Options
            options={fetchedOptions} 
            getOptionLabel = {getOptionLabelHandler}
            renderOption = {renderOptionHandler.bind(null, renderValue)}
            // Open props
            open={open} 
            onOpen={() => setOpen(true)} 
            onClose={onCloseHandler}
            // On change 
            onChange={onChangeHandler} 
            onInputChange={onInputChangeHandler}
            // Misc
            filterOptions={x => x}
            id={id}
            freeSolo = {true}
            value={value ? value : ''}
            // Visuals 
            openOnFocus // Very important, otherwise onCloseHandler won't be fired for example when we focus a field with a tab and delete its value.
                        // Funningly without this prop it still works correctly when we manually gain focus using the mouse.
            componentsProps={componentsProps}
            includeInputInList
            loading = {loading}
            size="small"
            fullWidth
            renderInput={(params) => <TextField {...params}  {...props} />}
            
          />
      </EAMBaseInput>
      );
};

EAMAutocomplete.defaultProps = {
  
}

export default React.memo(EAMAutocomplete, areEqual);