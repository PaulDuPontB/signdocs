import React from 'react';
import PropTypes from 'prop-types';
import { useDrag } from 'react-dnd';
import { useParams } from 'react-router-dom';
import ItemTypes from './ItemTypes';

function* tempId() {
  let index = new Date().valueOf();

  while (true) {
    // eslint-disable-next-line no-plusplus
    yield index++;
  }
}

//  x 	          decimal percent of page from left
//  y 	          decimal percent of page from top
//  widthPct      decimal ratio of width to page width
//  aspectRatio 	decimal ratio of width to height
//  page 	        page of the document (1-based index)

const defaultSignatureBBOX = Object.freeze({
  x: 0.45,
  y: 0.5,
  page: 1,
  widthPct: 0.17,
  aspectRatio: 1.5,
});

const defaultTextboxBBOX = Object.freeze({
  x: 0.45,
  y: 0.5,
  page: 1,
  widthPct: 0.17,
  aspectRatio: 3,
});

const FieldItem = (props) => {
  const { children, disabled } = props;
  const [, drag] = useDrag({
    canDrag: !disabled,
    item: {
      ...props,
      hideSourceOnDrag: true,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  let classNames = 'draggable';
  if (disabled) classNames += ' disabled-drag';
  return (
    <li ref={drag} className={classNames}>
      {children}
    </li>
  );
};

FieldItem.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.array,
    PropTypes.element,
    PropTypes.string,
  ]),
  disabled: PropTypes.bool.isRequired,
};

FieldItem.defaultProps = {
  children: null,
};

const Fields = ({ currAssignee }) => {
  const { docId } = useParams();
  // const tempId = () => `${new Date().valueOf()}`;

  const idGenerator = tempId();

  return (
    <>
      <h2>Fields</h2>
      <hr />
      <ul>
        <FieldItem
          assigneeId={currAssignee}
          type={ItemTypes.UNFILLED_SIGNATURE}
          id={idGenerator.next().value}
          docId={docId}
          disabled={!currAssignee}
          bbox={defaultSignatureBBOX}
        >
          Signature
        </FieldItem>
        <FieldItem
          assigneeId={currAssignee}
          type={ItemTypes.UNFILLED_TEXT}
          id={idGenerator.next().value}
          docId={docId}
          disabled={!currAssignee}
          placeholder="CURRENT_DATE"
          bbox={defaultTextboxBBOX}
        >
          <p>Date of Signature</p>
        </FieldItem>
        <FieldItem
          assigneeId={currAssignee}
          type={ItemTypes.UNFILLED_TEXT}
          id={idGenerator.next().value}
          docId={docId}
          disabled={!currAssignee}
          placeholder="SIGNEE_NAME"
          bbox={defaultTextboxBBOX}
        >
          <p>Signee&apos;s name</p>
        </FieldItem>
      </ul>
    </>
  );
};

Fields.propTypes = { currAssignee: PropTypes.string.isRequired };

export default Fields;
