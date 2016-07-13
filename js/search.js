$(document).ready( function() {

	var base = 'https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrnamespace=0&';
	var query = "";
	var end = '&gsrlimit=9&prop=pageimages|extracts&pithumbsize=350&pilimit=max&exintro&explaintext&exchars=150&exlimit=max&format=json&callback=?';

	var wikiAPIcall = "";

	// Get JSON data
	function search() {

		wikiAPIcall = base + query + end;

		$.ajax( {
			type: 'GET',
			url: wikiAPIcall,
			dataType: 'json',
			success: function(data) {
				/////Make List of Wiki entries for requested term////
				console.log(data);

				//Get each entries page Id from the data returned
				var entryIds = [];
				var entryArray = data.query.pages;
				entryIds = Object.keys(entryArray); //returns the keys (pageIds) for the object at data.query.pages
				console.log(entryIds);
				
				//Use the page Ids to access the properties for each entry
				function displayInfo(id) {
					var title = entryArray[entryIds[id]].title;
					var description = entryArray[entryIds[id]].extract;
					var image;
					if (entryArray[entryIds[id]].hasOwnProperty('thumbnail')) {
						image = entryArray[entryIds[id]].thumbnail.source;
					} else {
						//get random placeholder image
						var random = (Math.floor(Math.random() * 9) + 1).toString();
						image = 'img/placeholder-' + random + '.png';
					}
					var link = 'http://en.wikipedia.org/?curid=' + entryIds[id];

					//create a new card div for each entry and append it to the card holder row
					var card = "<div class='col-md-6 col-lg-4'>";
					card += "<a href=" + link + " target='blank'><div class='card'>";
					card += "<img class='card-img-top cover' src='" + image + "'>";
					card += "<div class='card-block'>";
					card += "<h4 class='card-title'>" + title + "</h4>";
					card += "<p class='card-text'>" + description + "</p>";
					card += "</div></div></a></div>";

					$('.card-holder').append(card);
					
				}

				//loops through each key, uses it in displayInfo() to access properties
				for (var id in entryIds) {
					displayInfo(id);
				}

				
			},
			error: function(err) {
				alert('There was a problem with your request: ' + err);
			}
		});

	}

	function setSearchParameter() {

		var searchTerm = "";
		$('.card-holder').html("");
		//Get the value of the input to be searched for
		searchTerm = $('#searchBox').val();
		query = 'gsrsearch=' + searchTerm;

	}

	//Call Wiki API when search button pressed
	$('#searchQuery').click( function() {

		//Set Search Parameter
		setSearchParameter();

		//Call API with new parameter and show results
		search();

		//Clear query from search box
		$('#searchBox').val('');

	});


	//Call Wiki API when enter key pressed
	$('#searchBox').keypress( function(key){

		if (key.which === 13) {

			//Set Search Parameter
			setSearchParameter();

			//Call API with new parameter and show results
			search();

			//Clear query from search box
			$('#searchBox').val('');
		}
		

	});





});





