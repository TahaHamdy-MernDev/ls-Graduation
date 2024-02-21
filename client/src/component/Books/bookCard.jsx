
import { Col } from "react-bootstrap";
import { BsArrowDownCircle } from "react-icons/bs";
import PropTypes from "prop-types";
import RatingComponent from "../rate";
import { useNavigate } from "react-router-dom";

const BookCard = ({ book }) => {
  const {
    _id,
    title,
    author,
    description,
    coverImage,
    downloads,
    reviews,
    ratings,
    formattedUpdatedAt,
  } = book;
  const imageUrl = `${coverImage?.url}`;

 const navigate=useNavigate()
 const hoverStyles = {
  textDecoration: 'underline',
  cursor: 'pointer',
};
const calculateAverageRating = (ratings) => {
  if (ratings?.length === 0) {
    return 0;
  }
  const totalRating = ratings?.reduce((sum, rating) => sum + rating.rating, 0);
  const averageRating = totalRating / ratings?.length;
  return averageRating.toFixed(1);
 };
  return (
    <>
      <Col lg={6} md={6} sm={12} >
      
        <div className="book2-img">
          <img src={imageUrl} alt="logo-book" />
          
        </div>
        
      </Col>
      <Col lg={6} md={6} sm={12}>
        <div className="book2-content">
          <h4 style={hoverStyles} onClick={()=>navigate(`/book-details/${_id}`)}>{title}</h4>
          <span>بواسطة {author}</span>
          <p>{description}</p>
          <div className="icon-book">
            <BsArrowDownCircle /> {downloads} تنزيل
          </div>
          <div className="review">
          <div className="div-review">
            {reviews?.length} مراجعات
            <RatingComponent edit={false} initialRating={calculateAverageRating(ratings)} />
          </div>
          <div className="edit">{formattedUpdatedAt}</div>
        </div>
        </div>
      
      </Col>
      
     <hr className="book__hr"/>
    </>
  );
};
BookCard.propTypes = {
  book: PropTypes.shape({
    title: PropTypes.string,
    _id: PropTypes.string,
    author: PropTypes.string,
    description: PropTypes.string,
    coverImage: PropTypes.string,
    downloads: PropTypes.number,
    rate: PropTypes.number,
    reviews: PropTypes.array,
    formattedUpdatedAt: PropTypes.string,
  }),
};
export default BookCard;
