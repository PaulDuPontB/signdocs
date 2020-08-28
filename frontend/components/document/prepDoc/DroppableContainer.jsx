/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable no-undef */
/* eslint-disable import/prefer-default-export */
import React from 'react';
import PropTypes from 'prop-types';
import { useDrop } from 'react-dnd';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ItemTypes, DraggableBox } from '../shared';
import {
  createContentField,
  updateContentField,
} from '../../../actions/contentFields';
import { convertBBOXtoPixels } from '../../../utils/contentField';

const DroppableContainer = ({ children, className, thisPage }) => {
  const acceptableTypes = [
    ItemTypes.UNFILLED_SIGNATURE,
    ItemTypes.UNFILLED_TEXT,
  ];
  const { docId } = useParams();
  const dispatch = useDispatch();
  const createCF = (cfData) => dispatch(createContentField(cfData));
  const updateCF = (cfData) => dispatch(updateContentField(cfData));

  // TODO: Fix this trash
  const allCFs = useSelector((state) => state.entities.contentFields);
  const contentFields = Object.values(allCFs).filter(
    (ele) => ele.docId === docId && ele.bbox?.page === thisPage,
  );

  const [, drop] = useDrop({
    accept: acceptableTypes,
    drop(item, monitor) {
      const delta = monitor.getDifferenceFromInitialOffset() || { x: 0, y: 0 };
      // let left = item.bbox.left || 0;
      // let top = item.bbox.top || 0;
      // eslint-disable-next-line prefer-const
      let { left, top, width, height } = convertBBOXtoPixels(
        item.bbox,
        thisPage,
      );
      left = Math.round(left + delta.x);
      top = Math.round(top + delta.y);
      const newBBOX = { ...item.bbox, left, top, width, height };
      if (allCFs[item.id]) {
        updateCF({ ...item, bbox: newBBOX });
      } else {
        createCF({ ...item, bbox: newBBOX });
      }
      return undefined;
    },
  });

  return (
    <div ref={drop} className={className}>
      {contentFields.map((cf) => {
        return (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <DraggableBox key={cf.id} cfData={cf} thisPage={thisPage} />
        );
      })}
      {children}
    </div>
  );
};

DroppableContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.array,
    PropTypes.element,
  ]).isRequired,
  className: PropTypes.string.isRequired,
  thisPage: PropTypes.number.isRequired,
};

export default DroppableContainer;
