
import express from "express"
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const app = express();
app.use(express.json());
app.use(cors());

// Database connection
mongoose.connect("mongodb+srv://ynagadivya36_db_user:Naga%405678@cluster0.i1v24ex.mongodb.net/TasktrackerDB").then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log("Error connecting to MongoDB:", err); 
})


app.get("/status", (req, res) => {
    res.json({ status: "Server running" });
});

// Models
const userSchema = {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp: String,
    otpExpires: Date,
    isVerified: { type: Boolean, default: false },
};

const PlannedTaskSchema = {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: [true, "Enter some task name"] },
    category: { type: String, enum: ['work', 'home', 'personal', 'project', 'other'] },
    date: { type: Date, default: Date.now }
};

const checklistSchema = {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    task: { type: String, required: [true, "Enter some task"] },
    done: { type: Boolean, default: false },
    order: { type: Number, default: 0},
    plannedTaskId: { type: mongoose.Schema.Types.ObjectId, ref: "PlannedTask", default: null }
};

const noteSchema = {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: [true, "Enter note title"] },
    content: { type: String, required: [true, "Enter note content"] },
    date: { type: Date, default: Date.now }
}

const User = mongoose.model("User", new mongoose.Schema(userSchema));
const PlannedTask = mongoose.model("Planned", new mongoose.Schema(PlannedTaskSchema), "plannedtasks");
const checklist = mongoose.model("Checklist", new mongoose.Schema(checklistSchema), "checkedtasks");
const note = mongoose.model("Note", new mongoose.Schema(noteSchema), "notes");

// Nodemailer

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "yalamarthinagadivya@gmail.com",
        pass: "iorpbqqkfcbqcige"
    }
});

transporter.verify((err, success) => {
    if(err) {
        console.log("Error with email transsporter:", err);
    }
    else {
        console.log("Email transporter is ready");
    }
})
// Controllers

app.post("/register", async (req, res) => {
    try {
        const {email, password} = req.body;

        const existingUser = await User.findOne({email});

        if(existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedpassword = await bcrypt.hash(password,10);
        const newUser = await User.create({email, password: hashedpassword});

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        newUser.otp = otp;
        newUser.isVerified = false;
        newUser.otpExpires = Date.now() + 10 * 60 * 1000;
        await newUser.save();

        await transporter.sendMail({
            from: `TaskTracker Application <yalamarthinagadivya@gmail.com>`,
            to: newUser.email,
            subject: "Verify registration - OTP",
            html: `
                <h2>Email Verification OTP</h2>
                <p>Your OTP for email verification is: <b>${otp}</b></p>
                <p>This OTP is valid for 10 minutes.</p>
            `
        });

        res.status(201).json({
            message: "User registered successfully",
            userId: newUser._id,
            email: newUser.email,
            isVerified: newUser.isVerified,
            otp: otp
            // token: jwt.sign({id: newUser._id}, "9fA3$kL2@XqP7!mR8TzWcD#H4JvB6eN", { expiresIn: '1h' })
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
    // res.json({ message: "User registered" });
});

app.post("/verify-otp", async( req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if(!user) {
            return res.status(404).json({ message: "Email not found" });
        }

        if(user.otp !== otp) {
            return res.status(400).json({ message: "Incorrect OTP" });
        }

        if(user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "OTP expired" });
        }

        user.otp = null;
        user.otpExpires = null;
        user.isVerified = true;

        await user.save();

        res.send("OTP verified");
    }
    catch (error) {
        res.status(500).json({ message: error.message});
    }  
});

app.post("/resend-otp", async( req, res) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({ email});

        if(!user) {
            return res.status(404).json({ message: "Email not found"});
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        
        await user.save();

        await transporter.sendMail({
            from: `TaskTracker Application <yalamarthinagadivya@gmail.com>`,
            to: user.email,
            subject: "Resend OTP for Email Verification",
            html: `
                <h2>Email Verification OTP</h2>
                <p>Your OTP for email verification is: <b>${otp}</b></p>
                <p>This OTP is valid for 10 minutes.</p>
            `
        });

        res.json({ message: "OTP resent successfully", otp: otp });

    }
    catch (error) { 
        res.status(500).json({ message: error.message});
    }
});

app.post("/login", async( req, res) => {
    const {email, password} = req.body;
    try {
    if( email && password ) {
        const user = await User.findOne({email});
        if(!user) {
            return res.status(404).json({ message: "Email not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(401).json({message: "Password incorrect"});
        }

        if(!user.isVerified) {
            return res.status(401).json({ message: "Email not verified"});
        }

    res.status(200).json({ message: "User logged in",
        userId: user._id,
        email: user.email,
        token: jwt.sign({id: user._id}, "9fA3$kL2@XqP7!mR8TzWcD#H4JvB6eN", { expiresIn: '1h' })
    });
    }
    }
    catch (error) {
        res.status(500).json({ message: error.message});
    }
});

app.post("/forgot-password", async(req, res) => {

    try {
    const email = req.body.email;
    const user = await User.findOne({ email});

    if(!user) {
        return res.status(404).json({ message: "Email not found"} );
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    await transporter.sendMail({
        from: `TaskTracker Application <yalamarthinagadivya@gmail.com>`,
        to: user.email,
        subject: "Password Reset OTP",
        html: `
            <h2>Password Reset OTP</h2>
            <p>Your OTP for password reset is: <b>${otp}</b></p>
            <p>This OTP is valid for 10 minutes.</p>
        `
    });

    res.json({ message: "Password reset otp sent", otp: otp });
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
});

app.post("/reset-password", async(req, res) => {

    const { email, otp, newPassword, confirmPassword } = req.body;
    try {
    if(newPassword !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match"});
    }
    
    const user = await User.findOne({ email });
    if(!user) {
        return res.status(404).json({ message: "Email not found"});
    }
    
    if(user.otp !== otp) {
        return res.status(400).json({message: "Incorrect OTP"});
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpires = null;

    await user.save();
    res.json( {message: "Password reset successful"});
    }
    catch(error) {
        res.status(500).json({message: error.message});
    }

});

// Require authorization to access other pages and actions

const authorize = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, "9fA3$kL2@XqP7!mR8TzWcD#H4JvB6eN");
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

// Pages accessed by users

app.get("/dashboard", authorize, async (req, res) => {
    res.json({ message: "Welcome to the dashboard" });
});

app.post("/add-planned-task", authorize, async (req, res) => {
    const { name, category, date } = req.body;
    try {

        const task = await PlannedTask.create({ userId: req.userId, name, category, date});

        res.status(201).json({ message: "Planned task added", task: task });

    }
    catch(error) {
        res.status(400).json({ message: error.message});
    }
});

app.get("/view-planned-tasks", authorize, async (req, res) => {

    const tasks = await PlannedTask.find({ userId: req.userId });

    res.status(200).json( { tasks: tasks });
});

app.delete("/delete-planned-task/:id", authorize, async (req, res) => {
    const task = await PlannedTask.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    
    if(!task) {
        return res.status(404).json({ message: "Task not found"});
    }

    res.json({ message: "Planned task deleted" });
});

app.put("/update-planned-task/:id", authorize, async (req, res) => {
    const { name, category, date } = req.body;

    const task = await PlannedTask.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        { name, category, date },
        { new: true }
    );

    if(!task) {
        return res.status(404).json({ message: "Task not found"});
    }

    res.json({ message: "Planned task updated", task });
});

app.post("/add-checklist-task", authorize, async (req, res) => {

    const { task, plannedTaskId } = req.body;

    try {
        const checklistItem = await checklist.create({ userId: req.userId, task ,plannedTaskId});
        res.status(201).json({ 
            message: "Checklist item added",
            checklistItem,
         });
    }
    catch(error) {
        res.status(400).json({ message: error.message});
    }
});

app.get("/view-checklist-items", authorize, async (req, res) => {

    const tasks = (await checklist.find({ userId: req.userId }).sort({ order: 1, createdAt: -1} ));

    res.json({ message: "List of checklist items", tasks });
});

// app.get("/view-checklist-items/:plannedTaskId", authorize, async (req, res) => {
//   const tasks = await checklist.find({
//     userId: req.userId,
//     plannedTaskId: req.params.plannedTaskId
//   }).sort({ order: 1, createdAt: 1 });

//   res.json({ tasks });
// });


app.put("/update-checklist-item/:id", authorize, async (req, res) => {

    const { task, done, order } = req.body;

    const checklistItem = await checklist.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        { task, done, order },
        { new: true, runValidators: true }
    );

    if(!checklistItem) {
        return res.status(404).json({ message: "Checklist item not found"});
    }
    res.json({ message: "Checklist item updated", checklistItem });
});

app.delete("/delete-checklist-item/:id", authorize, async (req, res) => {

    const checklistItem = await checklist.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    
    if(!checklistItem) {
        return res.status(404).json({ message: "Checklist item not found"});
    }

    res.json({ message: "Checklist item deleted" });
});

app.patch("/toggle-checklist-task/:id", authorize, async (req, res) => {
  const item = await checklist.findOne({
    _id: req.params.id,
    userId: req.userId
  });

  if (!item) {
    return res.status(404).json({ message: "Checklist item not found" });
  }

  item.done = !item.done;
  await item.save();

  res.json({
    message: "Checklist status toggled",
    item
  });
});


app.post("/add-note", authorize, async (req, res) => {
    const { title, content } = req.body;

    try {
        const newNote = await note.create({ userId: req.userId, title, content});
        res.status(201).json({ message: "Note added",
            title: newNote.title,
         });
    }
    catch(error) {
        res.status(400).json({ message: error.message});
    }
});


app.get("/view-notes", authorize, async (req, res) => {
    const notes = await note.find({ userId: req.userId });  
    res.json({ message: "List of notes", notes });
});

app.delete("/delete-note/:id", authorize, async (req, res) => {

    const noteItem = await note.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    
    if(!noteItem) {
        return res.status(404).json({ message: "Note not found"});
    }
    res.json({ message: "Note deleted" });
});

// no seperate routes since all controllers are in this file

app.listen(4000, () => {
    console.log("Server is running on port 4000");
})