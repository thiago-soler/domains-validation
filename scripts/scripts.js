$('#domainsForm').submit(function (e) {

	var $fullDomain = $('#fullDomain'),
		resultAreValidAllRules = domainsValidation.areValidAllRules($fullDomain.val());

	console.log(resultAreValidAllRules);

	return resultAreValidAllRules.status;

});