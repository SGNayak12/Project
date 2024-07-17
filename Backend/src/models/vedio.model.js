import mongoose,{Schema, Types} from 'mongoose'
import mongooseAggreagatePaginate from 'mongoose-aggregate-paginate-v2'

const Vedioschema=new Schema({
    videoFile:{type:String,required:true,},
    thumbnail:{type:String,required:true},
    owner:{
        Types:mongoose.Types.ObjectId,
        ref:"User"
    },
    title:{type:String,required:true},
    description:{type:String},
    duration:{type:Number},
    views:{type:Number,default:0},
    isPublished:{type:Boolean,default:true},
},
{
    timestamps:true
})
Vedioschema.plugin(mongooseAggreagatePaginate);
const Vedio =mongoose.model("Vedio",Vedioschema);
export {Vedio};