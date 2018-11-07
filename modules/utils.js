module.exports = {
    xorAr: function(a,b){
	for(x in a){
	    for(y in b){
		if(b[y] == a[x]){
		    b.splice(y,1)
		}
	    }
	}
	return b;
    },
}
