exports.distinct = function(bigArr, smallArr){
	var result = [];
	var contains = false;
	for (var i = bigArr.length - 1; i >= 0; i--) {
		contains = false;
		for (var j = smallArr.length - 1; j >= 0; j--) {
			if(smallArr[j].id == bigArr[i].id){
				contains = true;
				break;
			} 
		};
		if(!contains){
			result.push(bigArr[i]);
		}
	};
	return result;
}