import React from 'react';
import Rating from 'react-rating-stars-component';

const RatingComponent = ({rate, size, initialRating, onRatingChange,edit}) => {
  return (
    <div className=''>
        <Rating
      count={5}
      size={size||19}
      edit={edit}
      classNames="star-rating"
      isHalf={true} 
      value={initialRating}
      onChange={onRatingChange}
      fullIcon={<i className="fa fa-star"></i>}
      halfIcon={<i className="fa fa-star-half-alt"></i>}
      emptyIcon={<i className="far fa-star"></i>}
      activeColor="#ffd700"
    />
    {rate && (
    <div >{rate}</div> 
    )

    }
    </div>
  
  );
};

export default RatingComponent;
