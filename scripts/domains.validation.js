function ModelDomainsValidation () {

	var $private = {},
      $public = this;

  $public.resultValidation = {

    status: true,
    validationType: '',
    message: ''

  };


}

function ConstantsDomainsValidation () {

	var $private = {},
      $public = this;

  $public.MESSAGES_VALIDATION = {

    IS_NAME_DOMAIN_BASIC_FORMAT: 'Por favor, digite um domínio válido. Exemplo: "nomedodominio.com.br".',
    IS_VALID_NAME_DOMAIN: 'Por favor, digite um nome de domínio válido.',
    IS_NAME_DOMAIN_ONLY_NUMBERS: 'Preencha o nome do domínio utilizando no mínimo 2 caracteres. Por favor, não utilize apenas números.',
    
    IS_EXTENSION_BASIC_FORMAT: 'Por favor, digite uma extensão válida.',
    IS_VALID_EXTENSION: 'Por favor, digite uma extensão válida.',
    IS_EXTENSION_DOMAIN_ONLY_NUMBERS: 'Preencha a extensão do domínio utilizando no mínimo 2 caracteres. Por favor, não utilize apenas números.',
    IS_SUBDOMAIN: 'Por favor, digite um domínio válido. Subdomínios não são permitidos'

  } 

}

function DomainsValidation () {

	var $private = {},
      $public = this;

  $private.tldjs = window.tldjs;

  $private.regex = {

    // Faz match com strings que tem apenas numeros e caracteres aceitos em nomes de dominios
    typeA: function () {
      
      return /^[0-9-.]{2,63}$/g;

    },

    // Faz match com strings que tem letras numeros e simbolos aceitos para um nome de dominio valido respeitando o tamanho
    typeB: function () {
      
      return /^([a-z0-9-]){2,63}$/g;

    },

    // 
    typeC: function () {

      return /(^[-]|[-]$)/g;

    }

  };

  $private.CONSTANTS = new ConstantsDomainsValidation();

  /**
   * Verifica se a string nao contem hífen no inicio ou no fim
   * 
   * @param  {String} str String que sera testada a condicao
   * @return {Object} result Retorna tru caso exista a ocorrencia do hifen no inicio ou fim da string
   */
  $private.checkInitEndHyphen = function (str) {

    var result = $private.regex.typeC().test(str) || false;

    return result;

  };

  $private.onlyNumbers = function (str) {

    var result = $private.regex.typeA().test(str) || false;

    return result;
    
  };

  $private.nameDomainOnlyNumbers = function (nameDomain) {

    return $private.onlyNumbers(nameDomain);

  };

  $private.extensionOnlyNumbers = function (extension) {

    return $private.onlyNumbers(extension);

  };


  $public.getDomainSplit = function (fullDomain) {

    var split = '',
        result = {
          nameDomain: '',
          extension: '',
          domain: '',
          subdomain: ''
        },
        domain = result.domain = $private.tldjs.getDomain(fullDomain) || fullDomain,
        subdomain = result.subdomain = $private.tldjs.getSubdomain(fullDomain) || '',
        publicSuffix = $private.tldjs.getPublicSuffix(fullDomain) || '';

    if (subdomain !== '') {
      subdomain = subdomain + '.';
    }

    if (publicSuffix !== '') {
      publicSuffix = '.' + publicSuffix;
    }

    result.nameDomain =  subdomain + domain.replace(publicSuffix, '').toString();
    result.extension = publicSuffix.toString();

    return result;

  };

  $public.isBasicFormat = function (fullDomain) {

    var getDomainSplit = $public.getDomainSplit(fullDomain),
        MESSAGES_VALIDATION = $private.CONSTANTS.MESSAGES_VALIDATION,
        result = new ModelDomainsValidation().resultValidation;

    result.validationType = 'isBasicFormat';

    if (getDomainSplit.nameDomain === '') {

      result.message = MESSAGES_VALIDATION.IS_NAME_DOMAIN_BASIC_FORMAT;
      result.status = false;

      return result;

    }

    if (getDomainSplit.extension === '') {

      result.message = MESSAGES_VALIDATION.IS_EXTENSION_BASIC_FORMAT;
      result.status = false;

      return result;

    }
    
    return result;

  };

  $public.isValidNameDomain = function (fullDomain) {

    var getDomainSplit = $public.getDomainSplit(fullDomain),
        MESSAGES_VALIDATION = $private.CONSTANTS.MESSAGES_VALIDATION,
        result = new ModelDomainsValidation().resultValidation;

    result.validationType = 'isValidNameDomain';

    if ($private.checkInitEndHyphen(getDomainSplit.nameDomain) === true) {

      result.message = MESSAGES_VALIDATION.IS_VALID_NAME_DOMAIN;
      result.status = false;

      return result;

    }
    
    // Verifica se o nome do dominio tem apenas numeros
    if ($private.nameDomainOnlyNumbers(getDomainSplit.nameDomain) === true) {

      result.message = MESSAGES_VALIDATION.IS_NAME_DOMAIN_ONLY_NUMBERS;
      result.status = false;

      return result;

    }

    return result;

  };

  $public.isNotSubdomain = function (fullDomain) {

    var getDomainSplit = $public.getDomainSplit(fullDomain),
        MESSAGES_VALIDATION = $private.CONSTANTS.MESSAGES_VALIDATION,
        result = new ModelDomainsValidation().resultValidation;

    result.validationType = 'isNotSubdomain';
    
    // Verifica se o nome do dominio e um subdominio
    if (getDomainSplit.subdomain !== '') {

      result.message = MESSAGES_VALIDATION.IS_SUBDOMAIN;
      result.status = false;

      return result;

    }

    return result;

  };

  $public.isValidExtension = function (fullDomain) {

    var getDomainSplit = $public.getDomainSplit(fullDomain),
        MESSAGES_VALIDATION = $private.CONSTANTS.MESSAGES_VALIDATION,
        result = true;

    result.validationType = 'isValidExtension';
    
    // Verifica se a extensao do dominio tem apenas numeros
    if ($private.extensionOnlyNumbers(getDomainSplit.extension) === true) {

      result.message = MESSAGES_VALIDATION.IS_EXTENSION_DOMAIN_ONLY_NUMBERS;
      result.status = false;

      return result;

    }

    return result;

  };

	/**
	 * Verify if rules are valid
	 * @param  {String} fullDomain fullDomain(name, extension) informed by client
	 * @return {Boolean} result Returns object validation
	 */
  $public.areValidAllRules = function (fullDomain, options) {

    fullDomain = fullDomain || '';

    options = options || [
      'isBasicFormat',
      'isValidNameDomain'
    ];

    var result = new ModelDomainsValidation().resultValidation,
        listRules = options,
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

}

var domainsValidation = new DomainsValidation();