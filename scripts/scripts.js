document.getElementById('domainsForm').onsubmit = function (e) {

	e.preventDefault();

	var fullDomain = document.getElementById('fullDomain'),
		resultAreValidAllRules = domainsValidation.areValidAllRules(fullDomain.value);

	console.log(resultAreValidAllRules);

	return resultAreValidAllRules.status;

};
