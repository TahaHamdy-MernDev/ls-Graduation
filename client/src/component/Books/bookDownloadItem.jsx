import React from "react";
import { BsArrowDownCircle } from "react-icons/bs";
import { FaStar } from "react-icons/fa";
import RatingComponent from "../rate";
import { useNavigate } from "react-router-dom";
import { Container,Row,Col} from "react-bootstrap";


const BookDownloadItem = ({ _id, image, title, author, downloads, rate }) => {
  const navigate = useNavigate();
  const hoverStyles = {
    textDecoration: "underline",
    cursor: "pointer",
  };
  const imageUrl = `${image.url}`;
  return (
    <Container>
      <Row>
        <Col  lg={12} sm={12} md={12}>
        <div className="download-book">
      <img src={imageUrl}  alt="logo"/>
      <div>
      <h3  className=" book-title"
            onClick={() => navigate(`/book-details/${_id}`)}
          >
            {title}
          </h3>

      <p>بواسطة {author}</p>
      
      <div className="rate-book">
     
      <span className="">
      <BsArrowDownCircle  />   {downloads} تنزيل
          </span>
          
          <RatingComponent edit={false} initialRating={rate} />
      </div>
      </div>
      
    </div>
    <hr/>
    
        </Col>
      </Row>
    </Container>
   
    
    
    
    
      
  );
};

export default BookDownloadItem;
