const mongoose = require('mongoose')
const { string } = require('prop-types')
const { Schema } = mongoose

const boardSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    creatorId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    backgroundColor: {
        type: String,
    },
    backgroundImage:{
        type: String,
    },
},
{
    timestamps: true
})

module.exports = mongoose.model('board', boardSchema)
