import React                from 'react';
import { connect }          from 'react-redux';
import { changeItemName, changeItemText } from './../../actions';
import { InputGroup, FormControl } from 'react-bootstrap';
import './../../styles/bootstrap.css';

const NumberFieldSettings = ({item, onTextChanged, onItemNameChanged}) => {

  return (
    <div className="text-item">
      <form>
        <InputGroup>
          <InputGroup.Addon>Item Name</InputGroup.Addon>
          <FormControl type="text"
            value={item.itemName}
            onChange={(e) => { onItemNameChanged(e.target.value, item.id); }}
            placeholder="Enter new item name..."/>
        </InputGroup>
        <br />
        <InputGroup>
          <InputGroup.Addon>Item Text</InputGroup.Addon>
          <FormControl type="text"
            value={item.text}
            onChange={(e) => { onTextChanged(e.target.value, item.id); }}
            placeholder="Enter new item text..."/>
        </InputGroup>
      </form>
    </div>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    onItemNameChanged: (value, id) => (dispatch(changeItemName(value, id))),
    onTextChanged: (value, id) => (dispatch(changeItemText(value, id)))
  }
}

export default connect(null, mapDispatchToProps)(NumberFieldSettings);
