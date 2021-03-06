import React, { Component, PropTypes }  from 'react';
import { connect }                      from 'react-redux';
import { Responsive, WidthProvider }    from 'react-grid-layout';
import { itemSelected }                 from './../actions';
import ItemTypes                        from './../constants/item-types';
import { calculatableValueChanged }     from './../actions'
import './stage.css';
import TextItem                         from './items/static-text';
import NumberItem                       from './items/number-field';
import ResultItem                       from './items/result-number-field';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class Stage extends Component {
  constructor(props) {
    super(props);
    console.log('Stage->constructor');
    this.state = {
      mounted: false,
      layouts: this._getLayouts(props.items)
    }
  }

  _getLayouts = (items) => {
    console.log('Getting Laoyouts', items);
    return items.map(item => {
      let {i, x, y, w, h} = item;
      i = String(i);
      return {i, x, y, w, h};
    });
  }

  componentWillReceiveProps(nextProps) {

    const layouts = this.state.layouts;
    const newLayouts = this._getLayouts(nextProps.items);

    // decide whether ot not local state should be updated.
    // if item layputs changed then need to re-set layouts prop
    let layoutChangedFlag = false;

    if (newLayouts.length !== layouts.length) {
      layoutChangedFlag = true;
    } else {
      newLayouts.forEach(item => {
        // ei: existing item
        const ei = layouts.find(i => (i.i === item.i));
        if (!ei) { layoutChangedFlag = true; }
        if (ei.x !== item.x || ei.y !== item.y || ei.w !== item.w || ei.h !== item.h) {
          layoutChangedFlag = true;
        }
      });
    }

    console.log('layoutChangedFlag', layoutChangedFlag);

    if (layoutChangedFlag) {
      this.setState({layouts: newLayouts});
    }
  }

  componentDidMount() {
    this.setState({mounted: true});
  }

  onLayoutChange = (layout, layouts) => {
    console.log('Layout has changed');
  };

  // used to indicate selection of an item
  onDragStart = (param1, layoutItem) => {
    this.props.dispatch(itemSelected(parseInt(layoutItem.i, 10)));
  };

  onDragStop = (param1, layoutItem) => {
    console.log('onDragStop');
    console.log('param1', param1);
    console.log('layoutItem', layoutItem);
    // TODO: update layout
  }

  onResizeStop = (param1, layoutItem) => {
    console.log('onResizeStop');
    console.log('param1', param1);
    console.log('layoutItem', layoutItem);
    // TODO: update layout
  }

  onStageClicked = (e) => {
    //this.props.dispatch(itemSelected(0));
  }

  onRemoveItem = itemId => {
    console.log('removing item', itemId);
  }

  render() {
    const { items, selectedItem, dispatch } = this.props;
    let basicStyle = {
      backgroundColor: '#ffffff'
    };
    const itemsDivs = items.map((item) => {
      let style = basicStyle;
      if (item.id === selectedItem) {
        style = {
          ...basicStyle,
          boxSizing: 'border-box',
          MozBoxSizing: 'border-box',
          WebkitBoxSizing: 'border-box',
          border: '2px solid #f00',
        }
      }
      const datagrid = {w: item.w, h: item.h, x: item.x, y: item.y};
      let itemView = null;
      console.log('rendering stage');
      console.log('item', item);

      switch (item.type) {
        case ItemTypes.STATIC_TEXT:
          itemView = <TextItem itemName={item.itemName}
            itemText={item.text}
            onRemoveItem={() => {this.onRemoveItem(item.id)}} />
          break;
        case ItemTypes.NUMBER_FIELD:
          itemView = <NumberItem itemName={item.itemName}
            item={item}
            itemText={item.text}
            number={item.value}
            onNumberChanged={(value, itemId)=>{ console.log('number field changed', value, itemId); dispatch(calculatableValueChanged(value, itemId))} }
            onRemoveItem={() => {this.onRemoveItem(item.id)}} />
          break;
        case ItemTypes.NUMBER_RESULT:
          itemView = <ResultItem itemName={item.itemName}
            itemText={item.text}
            result={item.value}
            onRemoveItem={() => {this.onRemoveItem(item.id)}} />
          break;
        default:
      }

      return (
        <div style={style}
          key={item.id}

          data-grid={datagrid} >
          {itemView}
        </div>
      );
    });

    return (
      <div className="Stage" onClick={this.onStageClicked}>
        <ResponsiveReactGridLayout
          className="layout"
          layouts={{lg: this.state.layouts}}
          cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}
          isResizable={true}
          measureBeforeMount={false}
          useCSSTransforms={this.state.mounted}
          onLayoutChange={this.onLayoutChange}
          onDragStart={this.onDragStart}
          onDragStop={this.onDragStop}
          onResizeStop={this.onResizeStop}
          rowHeight={50}>
            {itemsDivs}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
};

Stage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  selectedItem: PropTypes.number.isRequired,
}

const mapStateToProps = (state) => {
  console.log('Stage->mapStateToProps');
  console.log(state);
  return {
    items: state.items.filter((item) => (item.type !== ItemTypes.STAGE)),
    selectedItem: state.selectedItem,
  };
};

export default connect(mapStateToProps)(Stage);
