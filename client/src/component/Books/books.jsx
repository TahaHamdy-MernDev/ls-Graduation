import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getAllBookAction } from '../../Redux/Action/bookAction';
import BookCard from './bookCard';
import BookDownloadItem from './bookDownloadItem';

function Book() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { books } = useSelector((state) => state.book);
  const [sortedItems, setSortedItems] = useState([]);

  useEffect(() => {
    dispatch(getAllBookAction());
  }, [dispatch]);

  useEffect(() => {
    setSortedItems(books);
  }, [books]);

  const calculateAverageRating = (ratings) => {
    // if (ratings.length === 0) return 0;
    // const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
    // return sum / ratings.length;
    if (ratings?.length === 0) {
      return 0;
    }
    const totalRating = ratings?.reduce(
      (sum, rating) => sum + rating.rating,
      0
    );
    const averageRating = totalRating / ratings?.length;
    return averageRating.toFixed(1);
  };

  const sortByCreatedAt = () => {
    const sorted = [...sortedItems].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setSortedItems(sorted);
  };

  const sortByDownloads = () => {
    const sorted = [...sortedItems].sort((a, b) => b.downloads - a.downloads);
    setSortedItems(sorted);
  };

  const sortByReviewCount = () => {
    const sorted = [...sortedItems].sort((a, b) => b.reviews.length - a.reviews.length);
    setSortedItems(sorted);
  };


  const formatLastUpdate = (updatedAt) => {
    const date = new Date(updatedAt);
    const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Intl.DateTimeFormat('ar-EG', optionsDate).format(date);
    const optionsTime = { hour: 'numeric', minute: 'numeric' };
    const formattedTime = new Intl.DateTimeFormat('ar-EG', optionsTime).format(date);
    return `اخر تحديث يوم ${formattedDate} الساعة ${formattedTime}`;
  };
  const getTopDownloadedBooks = (books) => {
    try {
      const sortedBooks = [...books].sort((a, b) => b.downloads - a.downloads);
      const top5Books = sortedBooks?.slice(0, 5);
      return top5Books;
    } catch (error) {
      return [];
    }
  };

  const topDownloadedBooks = getTopDownloadedBooks(books);
  return (
    <Container>
      <div className="book-header">
        <h2>استمتع بخدمة الكتب الالكترونيه</h2>
        <img className="b-image" src="../src/images/editbook.jpg" alt="logo" />
      </div>
      <div className="book1 mb-4">
        <span>
          {t("bookPage.softwareBooks")} ({sortedItems?.length})
        </span>
        <span>
          <Dropdown>
            <Dropdown.Toggle id="dropdown-basic">
              {t("bookPage.sortBy")}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={sortByCreatedAt}>{t('bookPage.sort_by_date')}</Dropdown.Item>
              <Dropdown.Item onClick={sortByDownloads}>{t('bookPage.sort_by_downloads')}</Dropdown.Item>
              <Dropdown.Item onClick={sortByReviewCount}>{t('bookPage.sort_by_review_count')}</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </span>
      </div>

      <Row>
        <Col lg={6} md={8} sm={12}>
          <h3 className="book-title mb-4"> {t("bookPage.books")}</h3>
          <div className="sec-book">
            <Row className="justify-content-center">
              {sortedItems.map((book, index) => (
                <BookCard key={index} book={{ ...book, formattedUpdatedAt: formatLastUpdate(book.updatedAt) }} />
              ))}
            </Row>
          </div>
        </Col>
        <Col lg={6} sm={12} className="pr-4">
          <h3 className=" book-title mb-4">{t("bookPage.mostDownloaded")}</h3>
          {topDownloadedBooks?.map((book, index) => (
            <BookDownloadItem
              _id={book._id}
              key={index}
              image={book.coverImage}
              title={book.title}
              author={book.author}
              downloads={book.downloads}
              rate={calculateAverageRating(book.ratings)}
            />
          ))}
        </Col>
      </Row>
    </Container>
  );
}

export default Book;