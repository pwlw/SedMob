$( document ).delegate("#addbed", "pageshow", function() {

	db.transaction(addbedmenusDB, errorCB);
	db.transaction( function(tx){ reloadmenusDB(tx, '#lit1group', '#lit1type') }, errorCB );
	db.transaction( function(tx){ reloadmenusDB(tx, '#lit2group', '#lit2type') }, errorCB );
	db.transaction( function(tx){ reloadmenusDB(tx, '#lit3group', '#lit3type') }, errorCB );
        
	$('#lit1group').change(function() {
		db.transaction( function(tx){ reloadmenusDB(tx, '#lit1group', '#lit1type') }, errorCB );
	});

	$('#lit2group').change(function() {
		db.transaction( function(tx){ reloadmenusDB(tx, '#lit2group', '#lit2type') }, errorCB );
	});

	$('#lit3group').change(function() {
		db.transaction( function(tx){ reloadmenusDB(tx, '#lit3group', '#lit3type') }, errorCB );
	});

// change lithology percentage
	$('#lit1percentage').change(function() {
		if ( parseInt($('#lit1percentage').val()) > 100 ) {
			$('#lit1percentage').val('100');
		}
		if ( (parseInt($('#lit1percentage').val()) + parseInt($('#lit2percentage').val()) + parseInt($('#lit3percentage').val()) ) != 100 ) {
			$('#lit2percentage').val(100-parseInt($('#lit1percentage').val()));
			$('#lit3percentage').val(100-parseInt($('#lit1percentage').val())-parseInt($('#lit2percentage').val()));
		}
	});

	$('#lit2percentage').change(function() {
		if ( parseInt($('#lit1percentage').val()) + parseInt($('#lit2percentage').val()) > 100 ) {
			$('#lit2percentage').val(100-parseInt($('#lit1percentage').val()));
		}
		$('#lit3percentage').val(100-parseInt($('#lit1percentage').val())-parseInt($('#lit2percentage').val()));
	});

	$('#lit3percentage').change(function() {
		if ( (parseInt($('#lit1percentage').val()) + parseInt($('#lit2percentage').val()) + parseInt($('#lit3percentage').val()) ) != 100 ) {
			$('#lit3percentage').val(100-parseInt($('#lit1percentage').val())-parseInt($('#lit2percentage').val()));
		}
	});
});

// save bed
function savebed () {
	db.transaction(savebedDB, errorCB);
}

//add/update bed
function savebedDB(tx){
	if ($('#thickness').val() == '') {
		navigator.notification.alert(
		'Thickness of the bed is required.',
		function (){},         // callback
		'Save bed',            // title
		'OK'                  // buttonName
		);
		return;
		}

	var tag = '';
	if (sessionStorage.selectedbed == 0) {
		tag = 'INSERT INTO beds (profileid, position, name, thickness, facies, notes, paleocurrent, boundary, lit1group, lit1type, lit1percentage, lit2group, lit2type, lit2percentage, lit3group, lit3type, lit3percentage, sizeclasticbase, phiclasticbase, sizeclastictop, phiclastictop, sizecarbobase, phicarbobase, sizecarbotop, phicarbotop, bioturbationtype, bioturbationintensity, structures, bedsymbols) VALUES ("'+ sessionStorage.selectedprofile +'", '+(parseInt(sessionStorage.numberofbeds)+1)+', "'+$('#bedname').val()+'", "'+$('#thickness').val()+'", "'+$('#facies').val()+'", "'+$('#notes').val()+'", "'+$('#paleocurrent').val()+'", "'+$('#boundary').val()+'", "'+$("#lit1group").val()+'", "'+$('#lit1type').val()+'", "'+$('#lit1percentage').val()+'", "'+$('#lit2group').val()+'", "'+$('#lit2type').val()+'", "'+$('#lit2percentage').val()+'", "'+$('#lit3group').val()+'", "'+$('#lit3type').val()+'", "'+$('#lit3percentage').val()+'", "'+$('#grainsizebottom option:selected').text()+'", "'+$('#grainsizebottom').val()+'", "'+$('#grainsizetop option:selected').text()+'", "'+$('#grainsizetop').val()+'", "'+$('#grainsizelimebottom option:selected').text()+'", "'+$('#grainsizelimebottom').val()+'", "'+$('#grainsizelimetop option:selected').text()+'", "'+$('#grainsizelimetop').val()+'", "'+$('#bioturbationtype').val()+'", "'+$('#intensity').val()+'", "'+$('#structurestype').val()+'", "'+$('#symbolstype').val()+'")';
	}
	else {
		tag = 'UPDATE beds SET name="'+$('#bedname').val()+'", thickness="'+$('#thickness').val()+'", facies="'+$('#facies').val()+'", notes="'+$('#notes').val()+'", paleocurrent="'+$('#paleocurrent').val()+'", boundary="'+$('#boundary').val()+'", lit1group="'+$("#lit1group").val()+'", lit1type="'+$('#lit1type').val()+'", lit1percentage="'+$('#lit1percentage').val()+'", lit2group="'+$('#lit2group').val()+'", lit2type="'+$('#lit2type').val()+'", lit2percentage="'+$('#lit2percentage').val()+'", lit3group="'+$('#lit3group').val()+'", lit3type="'+$('#lit3type').val()+'", lit3percentage="'+$('#lit3percentage').val()+'", sizeclasticbase="'+$('#grainsizebottom option:selected').text()+'", phiclasticbase="'+$('#grainsizebottom').val()+'", sizeclastictop="'+$('#grainsizetop option:selected').text()+'", phiclastictop="'+$('#grainsizetop').val()+'", sizecarbobase="'+$('#grainsizelimebottom option:selected').text()+'", phicarbobase="'+$('#grainsizelimebottom').val()+'", sizecarbotop="'+$('#grainsizelimetop option:selected').text()+'", phicarbotop="'+$('#grainsizelimetop').val()+'", bioturbationtype="'+$('#bioturbationtype').val()+'", bioturbationintensity="'+$('#intensity').val()+'", structures="'+$('#structurestype').val()+'", bedsymbols="'+$('#symbolstype').val()+'" WHERE id='+sessionStorage.selectedbed;
	}

	tx.executeSql(tag,[], function (tx,result) {}, errorCB);
	savetofile (tag);

	$.mobile.changePage($("#addprofile"));
	sessionStorage.numberofbeds = parseInt(sessionStorage.numberofbeds)+1;
}

// delete bed
function butdeletebed() {
	if (sessionStorage.selectedbed != 0) {
		navigator.notification.confirm(
		'Are you sure that you want to delete this bed?',  // message
		function (buttonIndex) {
			if (buttonIndex == 1) {
				db.transaction(deletebedDB, errorCB);
			}
		},
		'Delete bed',            // title
		'Yes,No'          // buttonLabels
        );
	}
	else {
		$.mobile.changePage($("#addprofile"));
	}
}

// return to profile view
function returntoprofile () {
	sessionStorage.selectedbed=0;
	$.mobile.changePage($("#addprofile"));
}

//populate menus in addbed page
function addbedmenusDB(tx){
	$('#bedname').val('');
	$('#thickness').val('');
	$('#facies').val('');
	$('#notes').val('');
	$('#paleocurrent').val('');
	$('#boundary').empty();
	$('#lit1group').empty();
	$('#lit1type').empty();
	$('#lit1percentage').val('');
	$('#lit2group').empty();
	$('#lit2type').empty();
	$('#lit2percentage').val('');
	$('#lit3group').empty();
	$('#lit3type').empty();
	$('#lit3percentage').val('');
	$('#grainsizebottom').empty();
	$('#grainsizetop').empty();
	$('#grainsizelimebottom').empty();
	$('#grainsizelimetop').empty();
	$('#symbolstype').empty();
	$('#structurestype').empty();
	$('#bioturbationtype').empty();
	$('#intensity').val('');

	// base boundary
	tx.executeSql('SELECT * FROM boundaries',[], function (tx,result) {
		var len = result.rows.length;
		$('#boundary').html('<option value="<none>"></option>').selectmenu('refresh');
		for (var i=0; i<len; i++) {
			$('#boundary').append('<option value="'+result.rows.item(i).name+'">'+result.rows.item(i).name+'</option>').selectmenu('refresh');
		}
	}, errorCB);

	// lithology 1,2,3
	tx.executeSql('SELECT * FROM typelithology',[], function (tx,result) {
		var len = result.rows.length;
		$('#lit1group').html('<option value="<none>"></option>').selectmenu('refresh');
		$('#lit2group').html('<option value="<none>"></option>').selectmenu('refresh');
		$('#lit3group').html('<option value="<none>"></option>').selectmenu('refresh');
		for (var i=0; i<len; i++) {
			$('#lit1group').append('<option value="'+result.rows.item(i).id+'">'+result.rows.item(i).name+'</option>').selectmenu('refresh');
			$('#lit2group').append('<option value="'+result.rows.item(i).id+'">'+result.rows.item(i).name+'</option>').selectmenu('refresh');
			$('#lit3group').append('<option value="'+result.rows.item(i).id+'">'+result.rows.item(i).name+'</option>').selectmenu('refresh');
		}
	}, errorCB);
/*
	tx.executeSql('SELECT * FROM indexlithology WHERE typeid='+$('#lit1group').val(),[], function (tx,result) {
		var len = result.rows.length;
		$('#lit1type').html('<option value="<none>"></option>').selectmenu('refresh');
		$('#lit2type').html('<option value="<none>"></option>').selectmenu('refresh');
		$('#lit3type').html('<option value="<none>"></option>').selectmenu('refresh');
		for (var i=0; i<len; i++) {
			$('#lit1type').append('<option value="'+result.rows.item(i).name+'">'+result.rows.item(i).name+'</option>').selectmenu('refresh');
			$('#lit2type').append('<option value="'+result.rows.item(i).name+'">'+result.rows.item(i).name+'</option>').selectmenu('refresh');
			$('#lit3type').append('<option value="'+result.rows.item(i).name+'">'+result.rows.item(i).name+'</option>').selectmenu('refresh');
		}
	}, errorCB);
*/
	$('#lit1percentage').val('100');
	$('#lit2percentage').val('0');
	$('#lit3percentage').val('0');

	// grain size
	tx.executeSql('SELECT * FROM grainclastic',[], function (tx,result) {
		var len = result.rows.length;
		$('#grainsizebottom').html('<option value="<none>"></option>').selectmenu('refresh');
		$('#grainsizetop').html('<option value="<none>"></option>').selectmenu('refresh');
		for (var i=0; i<len; i++) {
			$('#grainsizebottom').append('<option value="'+result.rows.item(i).phi+'">'+result.rows.item(i).name+'</option>').selectmenu('refresh');
			$('#grainsizetop').append('<option value="'+result.rows.item(i).phi+'">'+result.rows.item(i).name+'</option>').selectmenu('refresh');
		}
	}, errorCB);

	tx.executeSql('SELECT * FROM graincarbonate',[], function (tx,result) {
		var len = result.rows.length;
		$('#grainsizelimebottom').html('<option value="<none>"></option>').selectmenu('refresh');
		$('#grainsizelimetop').html('<option value="<none>"></option>').selectmenu('refresh');
		for (var i=0; i<len; i++) {
			$('#grainsizelimebottom').append('<option value="'+result.rows.item(i).phi+'">'+result.rows.item(i).name+'</option>').selectmenu('refresh');
			$('#grainsizelimetop').append('<option value="'+result.rows.item(i).phi+'">'+result.rows.item(i).name+'</option>').selectmenu('refresh');
		}
	}, errorCB);

	// symbols in bed / structures and fossils
	tx.executeSql('SELECT indexstructure.id AS id, indexstructure.name AS name, typestructure.name AS typename FROM indexstructure INNER JOIN typestructure ON typestructure.id=indexstructure.typeid',[], function (tx,result) {
		var len = result.rows.length;
		for (var i=0; i<len; i++) {
			$('#symbolstype').append('<option value="'+result.rows.item(i).id+'">'+result.rows.item(i).typename+' &gt; '+result.rows.item(i).name+'</option>').selectmenu('refresh');
			$('#structurestype').append('<option value="'+result.rows.item(i).id+'">'+result.rows.item(i).typename+' &gt; '+result.rows.item(i).name+'</option>').selectmenu('refresh');
		}
	}, errorCB);

	// bioturbation
	tx.executeSql('SELECT * FROM bioturbation',[], function (tx,result) {
		var len = result.rows.length;
		$('#bioturbationtype').html('<option value="<none>"></option>').selectmenu('refresh');
		for (var i=0; i<len; i++) {
			$('#bioturbationtype').append('<option value="'+result.rows.item(i).name+'">'+result.rows.item(i).name+'</option>').selectmenu('refresh');
		}
	}, errorCB);

	$('#intensity').val('0');

	// fill in fields if a profile is loaded
	if (sessionStorage.selectedbed != 0) {
		tx.executeSql('SELECT * FROM beds WHERE id="'+sessionStorage.selectedbed+'"',[], function (tx,result) {
			$('#bedname').val(result.rows.item(0).name);
			$('#thickness').val(result.rows.item(0).thickness);
			$('#facies').val(result.rows.item(0).facies);
			$('#notes').val(result.rows.item(0).notes);
			$('#paleocurrent').val(result.rows.item(0).paleocurrent);
			$('#boundary option[value="'+result.rows.item(0).boundary+'"]').prop('selected',true);
			$('#boundary').selectmenu("refresh",true);
			$('#lit1group option[value="'+result.rows.item(0).lit1group+'"]').prop('selected',true);
			$('#lit1group').selectmenu("refresh",true);
			$('#lit1type option[value="'+result.rows.item(0).lit1type+'"]').prop('selected',true);
			$('#lit1type').selectmenu("refresh",true);
			$('#lit1percentage').val(result.rows.item(0).lit1percentage);
			$('#lit2group option[value="'+result.rows.item(0).lit2group+'"]').prop('selected',true);
			$('#lit2group').selectmenu("refresh",true);
			$('#lit2type option[value="'+result.rows.item(0).lit2type+'"]').prop('selected',true);
			$('#lit2type').selectmenu("refresh",true);
			$('#lit2percentage').val(result.rows.item(0).lit2percentage);
			$('#lit3group option[value="'+result.rows.item(0).lit3group+'"]').prop('selected',true);
			$('#lit3group').selectmenu("refresh",true);
			$('#lit3type option[value="'+result.rows.item(0).lit3type+'"]').prop('selected',true);
			$('#lit3type').selectmenu("refresh",true);
			$('#lit3percentage').val(result.rows.item(0).lit3percentage);
			$('#grainsizebottom option[value="'+result.rows.item(0).phiclasticbase+'"]').prop('selected',true);
			$('#grainsizebottom').selectmenu("refresh",true);
			$('#grainsizetop option[value="'+result.rows.item(0).phiclastictop+'"]').prop('selected',true);
			$('#grainsizetop').selectmenu("refresh",true);
			$('#grainsizelimebottom option[value="'+result.rows.item(0).phicarbobase+'"]').prop('selected',true);
			$('#grainsizelimebottom').selectmenu("refresh",true);
			$('#grainsizelimetop option[value="'+result.rows.item(0).phicarbotop+'"]').prop('selected',true);
			$('#grainsizelimetop').selectmenu("refresh",true);
			$('#bioturbationtype option[value="'+result.rows.item(0).bioturbationtype+'"]').prop('selected',true);
			$('#bioturbationtype').selectmenu("refresh",true);
			$('#intensity').val(result.rows.item(0).bioturbationintensity);

			sessionStorage.selectedbedposition = result.rows.item(0).position;

			var splittedbed = result.rows.item(0).bedsymbols.split(",");
			var splittedstructures = result.rows.item(0).structures.split(",");
			for (var i=0; i<splittedbed.length; i++) {
				$('#symbolstype option[value="'+splittedbed[i]+'"]').prop('selected',true);
				$('#symbolstype').selectmenu("refresh",true);
			}
			for (i=0; i<splittedstructures.length; i++) {
				$('#structurestype option[value="'+splittedstructures[i]+'"]').prop('selected',true);
				$('#structurestype').selectmenu("refresh",true);
			}
		}, errorCB);
	}
}

//reload menus in addbed page
function reloadmenusDB(tx, elementgroup, elementtype){
	if ($(elementgroup).val() != '<none>') {
		tx.executeSql('SELECT * FROM indexlithology WHERE typeid='+$(elementgroup).val(),[], function (tx,result) {
			var len = result.rows.length;
			$(elementtype).empty();
			$(elementtype).html('<option value="<none>"></option>').selectmenu('refresh');
			for (var i=0; i<len; i++) {
				$(elementtype).append('<option value="'+result.rows.item(i).name+'">'+result.rows.item(i).name+'</option>').selectmenu('refresh');
			}
		}, errorCB);
	}
	else {
		$(elementtype).empty();
		$(elementtype).html('<option value="<none>"></option>').selectmenu('refresh');
	}

	if (sessionStorage.selectedbed != 0) {
		tx.executeSql('SELECT * FROM beds WHERE id="'+sessionStorage.selectedbed+'"',[], function (tx,result) {
			if ( elementtype == '#lit1type') {
				$('#lit1type option[value="'+result.rows.item(0).lit1type+'"]').prop('selected',true);
			}
			else if ( elementtype == '#lit2type') {
				$('#lit2type option[value="'+result.rows.item(0).lit2type+'"]').prop('selected',true);
			}
			else if ( elementtype == '#lit3type') {
				$('#lit3type option[value="'+result.rows.item(0).lit3type+'"]').prop('selected',true);
			}

			$(elementtype).selectmenu("refresh",true);
        }, errorCB);
    }
}
