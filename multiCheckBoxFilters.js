/**
 * multiCheckBoxFilters v1.0
 * Copyright 2021 Kam Cheng
 * Licensed under: SEE LICENSE IN MIT-LICENSE.txt
 */
/**
 * Multi CheckBox Filters
 * @version 1.0
 * @author Kam Cheng
 */

$.fn.multiCheckBoxFilters = function (options) {
	this.each(function (index) {	
		var defaultOption = { 
			searchFilter: false, 
			placeholderText: "Select below", 
			elementID: index, 
			selectAllCheckbox: false,
			mouseleave: false
		};
		
		var o = $.extend({ }, defaultOption, options || { });
		
		var $element = $(this).hide();
		var elementID = $element.attr("id") ? $element.attr("id") : o.elementID;
		
		var placeholderText = $(this).data("placeholder");	
		placeholderText = (placeholderText && placeholderText != "") ? placeholderText : o.placeholderText;
		
		var $multiOptionWrapper = $("<div class='multiOptionWrapper'></div>");
		
		var $multiOptionSelect = $("<div class='multiOptionSelect' id='multiOptionSelect_"+ elementID +"'>" + placeholderText + 
			"<span class='dropdownIcon'></span></div>");

		var $optionContainer = $("<div class='optionContainer' id='optionContainer_"+ elementID +"'></div>");
		var $optionHeader =	$("<div class='optionHeader' id='optionHeader_"+ elementID +"'></div>");
		var $optionContent = $("<div class='optionContent' id='optionContent_"+ elementID +"'></div>");
		
		if(o.searchFilter) {
			$("<input type='text' class='searchFilter' id='searchFilter_"+ elementID +"' value='' placeholder='Search for your selections...' /></div>").appendTo($optionHeader);
			$optionHeader.appendTo($optionContainer);
		} else if(o.selectAllCheckbox) {
			$("<input type='checkbox' class='selectAllCheckbox' id='selectAllCheckbox_"+ elementID +"' value='' />").appendTo($optionHeader);
			$("<div class='selectAllText'>Select All</div>").appendTo($optionHeader);
			$optionHeader.addClass('selectAll').appendTo($optionContainer);
		}
						
		$optionContent.appendTo($optionContainer);
		$multiOptionSelect.appendTo($multiOptionWrapper);
		$optionContainer.appendTo($multiOptionWrapper);
		$multiOptionWrapper.insertBefore(this);
	 
		if($.multiCheckBoxFilters.originalFilters[elementID] === undefined) { 
			$.multiCheckBoxFilters.originalFilters[elementID] = [];
		}
			
		$element.find("option").each(function () {
			var val = $(this).attr("value");

			if (val == undefined) val = '';
			
			var $row = $("<label/>");
			var $input = $("<input type='checkbox' class='optionCheckBox' value='" + val + "' id='"+ elementID +"_"+ val +"' />");
			var $optionName = $("<span class='optionName'>" + $(this).text() + "</span>");
			
			$input.appendTo($row);
			$optionName.appendTo($row);
			$row.appendTo($optionContent);
			
			if($.multiCheckBoxFilters[elementID] === undefined) {
				$.multiCheckBoxFilters[elementID] = {};
			}
			$.multiCheckBoxFilters[elementID][val] = $(this).text();

			$.multiCheckBoxFilters.originalFilters[elementID].push(val);
		});

		//on click listeners - open down options
		$multiOptionSelect.on("click", function () {
			var $dropdownIcon = $(".dropdownIcon", $(this));
			$optionContainer.toggleClass('on');
			$dropdownIcon.toggleClass('on');
		});
		
		if(o.mouseleave) {
			$('.multiOptionWrapper').mouseleave(function () {
				$optionContainer.removeClass('on');
				$('.dropdownIcon', $(this)).removeClass('on');
			});
		}
		
		var copyOriginalIDs = JSON.parse(JSON.stringify($.multiCheckBoxFilters.originalFilters[elementID]));
		
		//on click listeners - select checkbox options
		$(".optionCheckBox", "#optionContent_"+elementID).on("click", function(){
			var checkboxValue = $(this).val();
			
			if($(this).is(':checked')) {
				if($.multiCheckBoxFilters.updatedFilters[elementID] === undefined) {
					$.multiCheckBoxFilters.updatedFilters[elementID] = [];
				}
				$.multiCheckBoxFilters.updatedFilters[elementID].push(checkboxValue);
			} else {
				$.multiCheckBoxFilters.updatedFilters[elementID] = $.grep($.multiCheckBoxFilters.updatedFilters[elementID], function(value) {
					return value != checkboxValue;
				});
				$("#selectAllCheckbox_"+elementID).prop("checked", false);
			}
			
			$.multiCheckBoxFilters.selectionUpdated();
		});	
		
		if(o.searchFilter) {
			//search filters
			$('#searchFilter_' + elementID).keyup(function(){
				var inputtext = $(this).val().toLowerCase();
				$('.optionName', '#optionContent_' + elementID).each(function(){
					var text = $(this).text().toLowerCase();
						 
					(text.indexOf(inputtext) == 0) ? $(this).parent('label').show() : $(this).parent('label').hide();
				});
			});
		} else {
			//on click listeners - select all options
			$("#selectAllCheckbox_"+elementID).on("click", function(){	
				if($(this).is(':checked')) {
					$(".optionCheckBox", "#optionContent_"+elementID).prop("checked", true);
					$.multiCheckBoxFilters.updatedFilters[elementID] = copyOriginalIDs;
				} else {
					$(".optionCheckBox", "#optionContent_"+elementID).prop("checked", false);
					$.multiCheckBoxFilters.updatedFilters[elementID] = [];
				}
				
				$.multiCheckBoxFilters.selectionUpdated();
			});
		}
	});
};

$.multiCheckBoxFilters = {
	updatedFilters: {},
	originalFilters: {},
	selectionUpdated: function() {
		$.multiCheckBoxFilters.changeSelection($.multiCheckBoxFilters.updatedFilters);
	},
};

$.multiCheckBoxFilters.changeSelection = function(updatedFilters) {
	console.log("updatedFilters", updatedFilters);
	
	var programmingLanguages = [];
	var browsers = [];
	var colors = [];
	var selectionIDs = [];
	var shouldClearAllAppear = false;
	var $showSelectedFilters = $("#showSelectedFilters").empty();
	var $filterSelected = $('<span class="filterSelected" />'); 
	
	if(updatedFilters["programmingLanguages"] !== undefined && updatedFilters["programmingLanguages"].length > 0){
		updatedFilters["programmingLanguages"].forEach(function(v){
			$('<span>'+$.multiCheckBoxFilters["programmingLanguages"][v]+'<span class="removeFilter" data-id='+v+' data-filter="programmingLanguages">x</span></span>').appendTo($filterSelected);
		});	
		shouldClearAllAppear = true;
	}
	
	if(updatedFilters["browsers"] !== undefined && updatedFilters["browsers"].length > 0){
		updatedFilters["browsers"].forEach(function(v){
			$('<span>'+$.multiCheckBoxFilters["browsers"][v]+'<span class="removeFilter" data-id='+v+' data-filter="browsers">x</span></span>').appendTo($filterSelected);
		});
		shouldClearAllAppear = true;
	}
	
	if(updatedFilters["colors"] !== undefined && updatedFilters["colors"].length > 0){
		updatedFilters["colors"].forEach(function(v){
			$('<span>'+$.multiCheckBoxFilters["colors"][v]+'<span class="removeFilter" data-id='+v+' data-filter="colors">x</span></span>').appendTo($filterSelected);
		});
		shouldClearAllAppear = true;		
	}
	
	if(shouldClearAllAppear) {
		$('<span>Clear All<span class="removeFilter" data-id="clearall">x</span></span>').appendTo($filterSelected);
	}
	
	$filterSelected.appendTo($showSelectedFilters);
}


	