import bcrypt from "bcryptjs";
import adminDetail from "../../modale/adminDetail.js";
import nodemailer from "nodemailer";

export const approvedMail = async (req, res) => {
  // console.log("req===>", req);
  console.log("req===>", req.body);
  let img = req.file.path;
  const {
    company_name,
    address,
    city,
    state,
    country,
    phoneNo,
    mobileNo,
    emailId,
    ownerName,
    company_description,
    logo,
    regNo,
    panNo,
    discription,
    type,
    userName,
    password,
    machine,
    customer,
    employees,
    engineer,


  } = req.body;

  try {
    // const existinguser = await users.findOne(req.body);
    // const existinguser = await adminDetail.findOne(req.body.userName);

    // console.log("user------->", existinguser);
    // if (existinguser) {
    //   return res.status(404).json({ message: "User already exit" });
    // }
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log("password", hashedPassword);
    const newUser = await adminDetail.create({
      company_name: company_name,
      address: address,
      city: city,
      state: state,
      country: country,
      phoneNo: phoneNo,
      mobileNo: mobileNo,
      emailId: emailId,
      ownerName: ownerName,
      company_description:company_description,
      logo: img,
      regNo: regNo,
      panNo: panNo,
      discription: discription,
      type: type,
      userName: userName,
      password: hashedPassword,
      machine: machine,
      customer:customer,
      employees: employees,
      engineer:engineer

    });
    // const token = jwt.sign({ email: newUser.email, id: newUser._id }, "test", {
    //   expiresIn: "1hr",
    // });
    // return res.status(200).json({ result: newUser });
    return res
      .status(200)
      .json({ result: { userName: newUser.userName, logo: newUser.logo } });
    //  return res.status(200).json({ result: newUser, token:token });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json("someting went wrong......");
  }
};
export const addCompany_Sign_up  = async (req, res) => {
  const { email, password, company_name, confirm_password } = req.body;
  try {
    const existinguser = await adminDetail.findOne({ emailId: email });
    if (existinguser) {
      res.status(404).json("Email Id already exist");
    }
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const addCompany = await adminDetail.create({
      emailId: email,
      password: hashPassword,
      company_name: company_name,
    });
    if (addCompany) {
      res.status(201).json({
        message: "New user is created",
        result: addCompany._id,
        emailId: addCompany.emailId,
        password: password,
      });
    }
  } catch (error) {
    console.log("error pass", error);
    return res.status(500).json("Something went worng...");
  }
};

// export const addCompany_Sign_up = async (req, res) => {
//   const { email, password, company_name, confirm_password } = req.body;
//   if (typeof password === 'undefined') {
//     return res.status(400).json('Password is required');
//   }
//   console.log('req.body:', req.body); // Check the entire request body
// console.log('password:', password); // Check the value of the password field
//   try {
//     const existinguser = await adminDetail.findOne({ emailId: email });
//     if (existinguser) {
//       return res.status(404).json("Email Id already exists");
//     }

//     const salt =  bcrypt.genSaltSync(10);
//     console.log('password:', password);
//     console.log('salt:', salt);
//     const hashPassword = await bcrypt.hash(password, salt);
//     console.log('hashPassword:', hashPassword);

//     const addCompany = await adminDetail.create({
//       emailId: email,
//       password: hashPassword,
//       company_name: company_name,
//     });

//     if (!addCompany) {
//       return res.status(500).json("Failed to create a new user");
//     }

//     const transport = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: "shivani06.dongarwar@gmail.com",
//         pass: "ydubhqkvqsrvwpkq",
//       },
//       tls: {
//         rejectUnauthorized: false,
//       },
//     });

//     const mailOptions = {
//       to: email,
//       from: "shivani06.dongarwar@gmail.com",
//       subject: "MyMachineStore.com",
//       text: "Hello, this is the body of the email",
//       html: `
//       <p>Thank you for registering!</p>
//       <p>Your username: ${email}</p>
//       <p>Your password: ${password}</p>
//       <p>Please click the link below to log in:</p>
//       <a href="http://localhost:3001/vendorAuth">Login Form</a>`,
//     };

//     await transport.sendMail(mailOptions);

//     return res.status(201).json({
//       message: "New user is created",
//       result: addCompany._id,
//       emailId: addCompany.emailId,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json("Something went wrongin sending mail...");
//   }
// };
// export const superAdmin_Addcompany_Login = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const exist = await adminDetail.findOne({ emailId: email });
//     if (!exist) {
//       return res.status(404).json({ message: "No user found" });
//     }
//     const isPasswordCorrect = bcrypt.compare(password, exist.password);
//     if (!isPasswordCorrect) {
//       return res.status(400).json({ message: "Wrong Password" });
//     }
//     const token = jwt.sign(
//       { id: existinguser._id },
//       process.env.ACCESS_TOKEN_KEY,
//       { expiresIn: "1d" }
//     );
//     res.cookie("access_token_3", token, { httpOnly: true });
//     return res.status(200).json({ result: { id: existinguser._id } });
//   } catch (error) {
//     return res.status(500).json("Something went worng...");
//   }
// };


export const superAdmin_Addcompany_Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const exist = await adminDetail.findOne({ emailId: email });
    if (!exist) {
      return res.status(404).json({ message: "No user found" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, exist.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Wrong Password" });
    }
    const token = jwt.sign(
      { id: exist._id },
      process.env.ACCESS_TOKEN_KEY,
      { expiresIn: "1d" }
    );
    res.cookie("access_token_3", token, { httpOnly: true });
    return res.status(200).json({ result: { id: exist._id } });
  } catch (error) {
    return res.status(500).json("Something went wrong...");
  }
};
export const superAdminCompanyList = async (req, res) => {
  console.log("getreq===>", req.body);
  const pageSize = 8;
  const page = parseInt(req?.query?.page || "0");
  const total = await adminDetail.countDocuments({});
  try {
    const newUser = await adminDetail
      .find({}, { company_name: 1, ownerName: 1, managerName:1, emailId: 1,logo:1, city:1, phoneNo:1, status:1 })
      .limit(pageSize)
      .skip(pageSize * page);
    // console.log("newUser2===>", newUser);
    return res
      .status(200)
      .json({ result: newUser, totalPages: Math.ceil(total / pageSize) });
  } catch (err) {
    console.log(err);
    return res.status(500).json("someting went wrong......");
  }
};

export const CompanyDetail=async(req,res)=>{
  const { id } = req.query;
  try {
    const productDetail=await adminDetail.find({ _id: id});
    if(productDetail){
      return res.status(200).json({result:productDetail})
    }else {
      return res.status(404).json("No detail found")
    }
  } catch (error) {
    console.log("error----->", error.message);
    return res.status(500).json("someting went wrong......");
  }
}


export const AddCompanyDetail = async (req, res) => {
  console.log("body", req.body);
  const {
    company_name,
    address,
    city,
    state,
    image,
    country,
    phoneNo,
    email,
    ownerName,
    company_description,
    regNo,
    panNo,
    discription,
    type,
    password,
    userName,
    managerName,
    status,
    machine,
    customer,
    employees,
    engineer,
  } = req.body;
  const _id = req.body.companyId;
  console.log("id===>", _id);
  // let img = req.file.path;
  const data = await adminDetail.find({_id})
  let hashedPassword = null
  if(password!==data[0].password){
    const salt =await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);
  }

  try {
    const uData = await adminDetail
      .findByIdAndUpdate(
        _id,
        // {
        //   $set: req.body,
        // },
        {
          company_name: company_name,
          address: address,
          city: city,
          state: state,
          // logo: img,
          country: country,
          phoneNo: phoneNo,
          emailId: email,
          ownerName: ownerName,
          company_description:company_description,
          regNo: regNo,
          panNo: panNo,
          discription: discription,
          type: type,
          machine: machine,
          customer:customer,
          employees: employees,
          engineer:engineer,
          password: hashedPassword!=null ? hashedPassword: password,
          userName: userName,
          managerName: managerName,
          status: status,
        }
      );
    if (req.file) {
      await adminDetail.findByIdAndUpdate(_id, { logo: req.file.path });
    }
    if (uData) {
      return res.status(200).json("Updated successfully");
    } else {
      return res.status(404).json("Something went wrong");
    }
  } catch (error) {
    console.log("error----->", error.message);
    return res.status(500).json("someting went wrong......");
  }
};
export const AddCompanyVendorDetail = async (req, res) => {
  console.log("body", req.body);
  const {
    company_name,
    address,
    city,
    state,
    image,
    country,
    phoneNo,
    email,
    ownerName,
    company_description,
    regNo,
    panNo,
    discription,
    type,
    password,
    userName,
    managerName,
    status,
    machine,
    customer,
    employees,
    engineer,
  } = req.body;
  const { VendorID } = req.params;
  console.log("vendoradminid===>",VendorID);
  // let img = req.file.path;
  const salt = bcrypt.genSaltSync(10);

  const hashPassword = await bcrypt.hash(password, salt);

  try {
    const uData = await adminDetail
      .findByIdAndUpdate(
        _id,
        // {
        //   $set: req.body,
        // },
        {
          company_name: company_name,
          address: address,
          city: city,
          state: state,
          // logo: img,
          country: country,
          phoneNo: phoneNo,
          emailId: email,
          ownerName: ownerName,
          company_description:company_description,
          regNo: regNo,
          panNo: panNo,
          discription: discription,
          type: type,
          machine: machine,
          customer:customer,
          employees: employees,
          engineer:engineer,
          password: hashPassword,
          userName: userName,
          managerName: managerName,
          status: status,
        }
      )
      .clone();
    if (req.file) {
      await adminDetail.findByIdAndUpdate(_id, { logo: req.file.path }).clone();
    }
    if (uData) {
      return res.status(200).json("Updated successfully");
    } else {
      return res.status(404).json("Something went wrong");
    }
  } catch (error) {
    console.log("error----->", error.message);
    return res.status(500).json("someting went wrong......");
  }
};
export const deleteCompany = async (req, res) => {
  console.log("delete====>", req.params.id);
  const { id } = req.params;
  try {
    const newUser = await adminDetail.findByIdAndDelete({
      _id: id,
    });
    console.log("newUser===>", newUser);
    return res.status(200).json("Delete Successfully");
  } catch (err) {
    console.log("error----->", err.message);
    return res.status(500).json("Sorry Can't Delete Company......");
  }
};

