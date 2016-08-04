function ModelDomainsValidation () {

	var $private = {},
		$public = this;

	$public.resultValidation = {

		status: true,
		message: ''

	};


}

function ConstantsDomainsValidation () {

	var $private = {},
		$public = this;

	$public.MESSAGES_VALIDATION = {

		IS_SUBDOMAIN: 'Por favor, digite um domínio válido. Subdomínios não são permitidos'

	} 

}

function DomainsValidation () {

	var $private = {},
		$public = this;

	$private.regex = {

		typeA: /^[0-9-.]{2,63}$/g,
		typeB: /^[0-9-.]{2,63}$/g,
		type: /[0]/g

	};

	$private.CONSTANTS = new ConstantsDomainsValidation();

	$private.onlyNumbers = function (fullDomain) {

		var result = false;


	};

	$public.getDomainSplit = function (fullDomain) {

		var split = '',
			result = {
				nameDomain: '',
				extension: '',
				domain: '',
				subdomain: ''
			},
			domain = result.domain = $public.tldjs.getDomain(fullDomain),
			subdomain = result.subdomain = $public.tldjs.getSubdomain(fullDomain),
			publicSuffix = '.' + $public.tldjs.getPublicSuffix(fullDomain);

		if (subdomain !== '') {
			subdomain = subdomain + '.';
		}

		result.nameDomain =  subdomain + domain.replace(publicSuffix, '');
		result.extension = publicSuffix;

		return result;

	};

	$public.isValidNameDomain = function (fullDomain) {

		var getDomainSplit = $public.getDomainSplit(fullDomain),
			MESSAGES_VALIDATION = $private.CONSTANTS.MESSAGES_VALIDATION,
			result = new ModelDomainsValidation().resultValidation;


		if (getDomainSplit.subdomain !== '') {

			result.message = MESSAGES_VALIDATION.IS_SUBDOMAIN;
			result.status = false;

		}


		return result;

	};

	$public.isValidExtension = function (fullDomain) {

		var getDomainSplit = $public.getDomainSplit(fullDomain),
			result = true;

		return result;

	};

	/**
	 * Verify if rules are valid
	 * @param  {String} fullDomain fullDomain(name, extension) informed by client
	 * @return {Boolean} result Returns object validation
	 */
	$public.areValidAllRules = function (fullDomain) {

		var result = new ModelDomainsValidation().resultValidation,
			listRules = [
				'isValidNameDomain',
				'isValidExtension'
			],
			idx = 0,
			rule = '',
			resultRule = true;

		for (idx in listRules) {

			rule = listRules[idx];

			resultRule = $public[rule](fullDomain);

			if (resultRule.status === false) {

				result = resultRule;

				break;

			}

		}

		return result;

	}

	$public.tldjs = window.tldjs;

}

var domainsValidation = new DomainsValidation();