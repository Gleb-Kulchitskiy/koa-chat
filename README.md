# koa-chat
Simple Long Polling koa-chat whis saving masseges to the MondoDB, and several methods for obtaining documents.

## API

### Method

- [x] __*'/subscribe'*__ [*GET*] - подписка на нового пользователя в чате.
- [x] __*'/publish'*__ [*POST*] - создание нового сообщения с записью сообщения в MongoDB.
- [x] __*'/messages/single/:messageById'*__ [*GET*] - получение сообщения из базы данных по ObjectId.
- [x] __*'/messages/list/:number'*__ [*GET*] - получение сообщений начиная с первого сохраненного с шагом в 10, при каждом запросе. 0 - первые 10, 1- следующие 10 и т.д.

Приложение осуществляет валидацию корректности email адреса и текста сообщения на уровне Mongoose, перед записью в БД. Текст не должен быть пустой строкой или превышать 100 символов.



