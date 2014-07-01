class Questionnaire
    constructor: (options) ->
        options = options || {};
        options.check = new Checkbox(options);
        options.scale = new ScaleTable(options);
        options.other = new Other(options);
        options.validation = new Validation(options);
