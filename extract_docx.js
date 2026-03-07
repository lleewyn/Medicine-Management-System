const fs = require('fs');
const mammoth = require('mammoth');

mammoth.extractRawText({path: "Báo cáo cuối kì.docx"})
    .then(function(result){
        const text = result.value;
        console.log("--- START DOCX CONTENT ---");
        console.log(text);
        console.log("--- END DOCX CONTENT ---");
    })
    .catch(function(err){
        console.error(err);
    });
