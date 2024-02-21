import { useState } from 'react'
import { Container, Form, } from 'react-bootstrap'
import i18n from '../../i18n'

import { useTranslation } from 'react-i18next'
import AddBookSuggestion from './addBookSuggestion';
import AddCourseSuggestion from './addCourseSuggestion';
const AddSuggestions = () => {
  const { t } = useTranslation();
  const [suggestType, setSuggestType] = useState("Book")
  const handleSuggestType = () => {
    setSuggestType(suggestType === "Book" ? "Course" : "Book")
  }

  return (
    <Container dir={i18n.dir()}>
      <Form.Group controlId="courseDuration" className="courseduration mb-2">
        <Form.Label  className='label'>{t('Suggest.choose')}</Form.Label>
        <Form.Control
        id="text"
          as="select"
          onChange={handleSuggestType}
          value={suggestType}
        >
          <option value="" disabled>
            {t('Suggest.choose')}
          </option>
          <option value="Book">{t('Suggest.book')}</option>
          <option value="Course">{t('Suggest.course')}</option>
        </Form.Control>
      </Form.Group>

      {suggestType === "Book" && (
        <AddBookSuggestion />
      )}

      {suggestType === "Course" && (
        <AddCourseSuggestion />
      )}
    </Container>
  )
}

export default AddSuggestions