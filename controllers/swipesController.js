const user = require("../models/user");

//POST para poder enviar en id del usuario que da like
exports.saveLike = async (req, res) => {
    const { id } = req.params; // recibe  
    const { userId } = req.body; // manda 
  try {
    const userReceiveLike = await user.findById(id); 
    const userWhoSendLike = await user.findById(userId); 

    if(!userWhoSendLike.swipes.includes(id) && userReceiveLike.swipes.includes(userId)){
        userWhoSendLike.swipes.push(id)
        //match
        userWhoSendLike.matches.push(id)
        userReceiveLike.matches.push(userId)
    }

    if(!userWhoSendLike.swipes.includes(id)){
        userWhoSendLike.swipes.push(id)
    }

    await userReceiveLike.save();
    await userWhoSendLike.save();
    return res.status(201).json({ message: "liked" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//POST 
exports.saveDislike = async (req, res) => {
    const { id } = req.params; // recibe 
    const { userId } = req.body; // manda 
  try {
    const userReceiveDislike = await user.findById(id); 
    const userWhoSendDislike = await user.findById(userId); 

    if(userWhoSendDislike.swipes.includes(id)){
        userWhoSendDislike.swipes.pop(id)
        userWhoSendDislike.matches.pop(id)
        userReceiveDislike.matches.pop(userId)
    }

    await userReceiveDislike.save();
    await userWhoSendDislike.save();
    return res.status(201).json({ message: "Disliked" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};