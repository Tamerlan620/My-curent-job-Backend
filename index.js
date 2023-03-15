import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import fileUpload from 'express-fileupload';


const app = express();

app.use(express.json());
app.use(cors());
app.use(fileUpload());
app.use(express.static('public/uploads'))

const dtbase = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"54321",
    // f48(W@H8Hm>EyHC
    database:"fixed_assets"
})




// -----------------------------------------------GET REQUEST-------------------------------------------------

app.get('/',(req, res)=>{
    res.json("hello this is backend");

})

app.get("/addFixedAssetName", (req, res) => {
    const q = "SELECT * FROM nameoffa";
    dtbase.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    });
});

app.get("/consolidation", (req, res) => {
    const q = "SELECT * FROM consolidation";
    dtbase.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    });
});

app.get("/addFixedAssets", (req, res) => {
    const q = "SELECT * FROM addnewfa";
    dtbase.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    });
});



app.get("/new", (req, res) => {
    const q = "SELECT * FROM bought_fixed_assets";
    dtbase.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    });
});


app.get("/report/:subsidiary", (req, res) => {
    const Subsid = req.params.subsidiary;
    const q = "SELECT * FROM report WHERE subsidiary = ?";
    dtbase.query(q,Subsid, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    });
});


app.get("/reports", (req, res) => {
    const q = "SELECT * FROM report";
    dtbase.query(q,(err, data) => {
        if (err) {
            console.log(err);
            // return res.json(err);
        }
        return res.json(data);
    });
});



// -----------------------------------------------POST REQUEST-------------------------------------------------


app.post("/addFixedAssetName",(req, res)=>{
    const quer1 = "INSERT INTO nameoffa (`inventar_number`,`name`,`group`,`unit`,`producing_country`,`serial_number`) VALUES (?)"
    const values1 =[
        req.body.inventar_number,
        req.body.name,
        req.body.group,
        req.body.unit,
        req.body.producing_country,
        req.body.serial_number,
    ]

    dtbase.query(quer1,[values1],(err,data)=>{
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json('FA has been created sucs');
    })
})



app.post("/addFixedAssets", (req, res) => {
    const quer = "INSERT INTO addnewfa (`status`,`registrid`,`currentdate`,`subsidiary`,`seller`,`amount`,`document_name`,`document`) VALUES (?)"
    const values =[
        'written',
        req.body[1],
        req.body[4],
        req.body[2],
        req.body[3],
        req.body[5],
        req.body[6],
        req.body[6] ? 'var' : 'yox'
    ]

    dtbase.query(quer,[values],(err,data)=>{
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json('FA has been created sucs');
    })
    req.body[0].map(data=>{
        const quer = "INSERT INTO bought_fixed_assets (`inventer_number`,`name`,`quantity`,`price`,`amount`,`regitr_numb`,`subsidiary`,`seller`,`date`,`status`,`VAT`,`group`) VALUES (?)"

        const values =[
        data.inventar_number,
        data.name,
        1,
        data.price,
        data.amount,
        req.body[1],
        req.body[2],
        req.body[3],
        req.body[4],
        0,
        data.VAT,
        data.group
        ]

        dtbase.query(quer,[values],(err,data)=>{
            if (err) {
                // console.log(err);
                return res.json(err);
            }
            // return res.json('FA has been created sucs');
        })
    })

})

app.post("/consolidationPhoto", (req, res) => {
    const filename = req.files.screenshot.name;
    const file = req.files.screenshot;
    let uploadPath = "../myjob/public/uploads/" + filename;
    file.mv(uploadPath, (err,data) => {

        if (err) {
            // return res.send(err);
        }
    });
    res.send(200);

});




app.post("/addFixedAssetsPhoto", (req, res) => {
    console.log(req.body)
    const filename = req.files.screenshot.name;
    const file = req.files.screenshot;
    let uploadPath = "../myjob/public/uploads/" + filename;
    file.mv(uploadPath, (err) => {
        if (err) {
            // return res.send(err);
        }
    });
    // res.send(200);

});



// -----------Save zamanı şəklin adı da dəyişsin------------


app.post("/approveReport",(req, res)=>{
    req.body[0].map(data=>{
    const quer1 = "INSERT INTO report (`fixed_asset`,`fixed_asset_id_number`,`quantity`,`subsidiary`,`workers`,`department`,`serial_numbers`,`group` ,`handed_status`) VALUES (?)"
    const values1 =[
        data.name,
        data.inventer_number,
        1,
        data.subsidiary,
        "",
        "",
        "",
        data.group,
        "",
    ]
        dtbase.query(quer1,[values1],(err,data)=>{
        if (err) {
            console.log(err);
            // return res.json(err);
        }
        // return res.json('FA has been created sucs');
        })
    })
})


app.post("/consolidation", (req, res) => {
    const quer = "INSERT INTO consolidation (`registrnumber`,`currentdate`,`subsidiary`,`fixed_asset`,`faidnumber`,`notes`,`worker`,`department`,`document`,`exworker`,`exworkerdepartment`,`document_name`,`handedtime`,`status`) VALUES (?)"
    const values =[
        req.body[0],
        req.body[1],
        req.body[2],
        req.body[3].fixed_asset,
        req.body[3].fixed_asset_id_number,
        req.body[4].notes,
        req.body[4].workers,
        req.body[4].department,
        req.body[5].length>0 ? "var" : "yox",
        req.body[3].workers,
        req.body[3].department,
        req.body[5].length>0 ? req.body[6] : "",
        req.body[4].date,
        'written'
    ]

    dtbase.query(quer,[values],(err,data)=>{
        if (err) {
            console.log(err);
            // return res.json(err);
        }
        // return res.json('FA has been created sucs');
    })


})




// -----------------------------------------------PUT REQUEST-------------------------------------------------



app.put("/consolidationPhoto", (req, res) => {
    const q = "UPDATE consolidation SET `document_name`= ?,`document`= ? WHERE registrnumber=?";
    const values = [
        req.body[1],
        "var"
    ];
    dtbase.query(q, [...values,req.body[0]], (err, data) => {
        if (err) return res.send(err);
        // return res.json(data);
    });
});
app.put("/addFixedAssetsPhotoName", (req, res) => {
    console.log(req.body)
    const q = "UPDATE addnewfa SET `document_name`= ?,`document`= ? WHERE registrid=?";
    const values = [
        req.body[1],
        "var"
    ];
    dtbase.query(q, [...values,req.body[0]], (err, data) => {
        if (err) return res.send(err);
        // return res.json(data);
    });
});



app.put("/consolidation", (req, res) => {
    const q = "UPDATE report SET `workers`= ?, `department`= ?, `handed_status`= ? WHERE fixed_asset_id_number = ? AND subsidiary = ?";
    const values = [
        req.body[0].worker,
        req.body[0].department,
        "yes"
    ];
    // console.log(req.body[0].faidnumber)
    dtbase.query(q, [...values,req.body[0].faidnumber,req.body[0].subsidiary], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });

    const q1 = "UPDATE consolidation SET `currentdate`= ?, `notes`= ?, `worker`= ?, `department`= ?, `handedtime`= ?, `status`= ? WHERE registrnumber = ?";
    const values1 = [
        req.body[0].currentdate,
        req.body[0].notes,
        req.body[0].worker,
        req.body[0].department,
        req.body[0].handedtime,
        "aproved",
    ];
    dtbase.query(q1, [...values1,req.body[0].registrnumber], (err, data) => {
        console.log(err,data)
        // if (err) return res.send(err);
        // return res.json(data);
    });
});


app.put("/consolidationdata", (req, res) => {
    const RegNum = req.body[0]
    const q = "UPDATE consolidation SET `currentdate`= ?, `worker`= ?, `department`= ?, `handedtime`= ?, `notes`= ? WHERE registrnumber = ?";
    const values = [
        req.body[1],
        req.body[2],
        req.body[3],
        req.body[4],
        req.body[5],
    ];
    dtbase.query(q, [...values,RegNum], (err, data) => {
        console.log(err,data)
        if (err) return res.send(err);
        return res.json(data);
    });
    // console.log(req.body[0])
});





app.put("/addFixedAssetName/:id", (req, res) => {
    const registrID = req.params.id;
    const q = "UPDATE nameoffa SET `name`= ?, `group`= ?, `unit`= ?, `producing_country`= ?, `serial_number`= ? WHERE id = ?";
    const values = [
        req.body.name,
        req.body.group,
        req.body.unit,
        req.body.producing_country,
        req.body.serial_number
    ];
    dtbase.query(q, [...values,registrID], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
});


app.put("/addFixedAssets/:id", (req, res) => {
    const registrID = req.params.id;
    const q = "UPDATE addnewfa SET `currentdate`= ?, `subsidiary`= ?, `seller`= ?, `amount`= ? WHERE registrid = ?";
    const values = [
        req.body.currentdate.slice(0,10),
        req.body.subsidiary,
        req.body.seller,
        req.body.amount,

    ];
    dtbase.query(q, [...values,registrID], (err, data) => {
        if (err) {
        // console.log(err)
            return res.send(err)
        };
        // console.log(data)
        return res.json(data);
    });
});

app.put("/approveFixedAssets/:id", (req, res) => {
    const registrID = req.params.id;

    const q ="UPDATE addnewfa SET `currentdate`= ?, `subsidiary`= ?, `seller`= ?, `amount`= ?,`status`= ? WHERE registrid = ?"

    const values = [
        req.body[0].currentdate.slice(0,10),
        req.body[0].subsidiary,
        req.body[0].seller,
        req.body[0].amount,
        'approved',
    ]

    dtbase.query(q, [...values,registrID], (err, data) => {
        if (err) {
            // return res.send(err)
        };
        // return res.json(data);
    });


    req.body[1].map(data=>{
        const q1 = "UPDATE bought_fixed_assets SET `inventer_number`= ?, `name`= ?, `price`= ?, `amount`= ?, `subsidiary`= ?, `date`= ?, `VAT`= ?, `status`= ? WHERE regitr_numb = ? AND id = ?";

        const values1 = [
            data.inventer_number,
            data.name,
            data.price,
            data.amount,
            req.body[0].subsidiary,
            req.body[0].currentdate.slice(0,10),
            data.VAT,
            1
        ];
        // console.log(q,values)
        dtbase.query(q1, [...values1,registrID,data.id], (err, data) => {
            if (err) {
                console.log(err)
                // return res.send(err)
            };
            console.log(data)
            // return res.json(data);
        });
    })

});


app.put("/addFixedAssets2/:id", (req, res) => {
    const registrID = req.params.id;
    req.body[0].map(data=>{
        const q = "UPDATE bought_fixed_assets SET `inventer_number`= ?, `name`= ?, `price`= ?, `amount`= ?, `subsidiary`= ?, `date`= ?, `VAT`= ? WHERE regitr_numb = ? AND id = ?";

        const values = [
            data.inventer_number,
            data.name,
            data.price,
            data.amount,
            req.body[1].subsidiary,
            req.body[1].currentdate.slice(0,10),
            data.VAT
        ];
        dtbase.query(q, [...values,registrID,data.id], (err, data) => {
            if (err) {
                console.log(err)
                // return res.send(err)
            };
            console.log(data)
            // return res.json(data);
        });
    })
});





app.listen(4444,()=>{
    console.log('connected backend')
})