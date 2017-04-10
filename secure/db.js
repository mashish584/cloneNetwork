
 

function findData(res,modal,object){

	return new Promise(function(resolve,reject){

		modal.findOne(object,(err,data) => {
			if(err)  reject(err);
			if(data) resolve(data);
		});

	});
	
}

module.exports.findData = findData;