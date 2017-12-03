const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
 
const messageSchema = new mongoose.Schema({
  email:   {
    type:     String,
    required: "Укажите пожалуйста email",
    validate: [{
      validator: function checkEmail(value) {
        return /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value);
      },
      msg:       'Некорректный Email.'
    }]
  },
  message: {
    type:     String,
    required: "Введите пожалуйста сообщение",
    validate: [{
      validator: function checkMassege(value) {
        return /^[а-яА-Яa-zA-Z0-9]{1,100}$/.test(value);
      },
      msg:       'Сообщение не должно быть пустым, но и не доложно превышать 100 символов.'
    }]
  }
},
{
  timestamps: true
});

messageSchema.plugin(mongoosePaginate);
module.exports = messageSchema;
