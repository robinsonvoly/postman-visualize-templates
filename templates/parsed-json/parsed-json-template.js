// Template for parsing JSON data retrieved by Postman
// Allows for parsing nested JSON strings
// Additionally implements jsonpath for querying objects with JSONPath expressions

// Access the response data JSON as a JS object
const res = pm.response.json();

// -----------------------
// - Handlebars Template -
// -----------------------

// Configure template
let template = `
<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/jsonpath@1.0.2/jsonpath.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.20.0/prism.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.20.0/components/prism-json.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.20.0/plugins/line-numbers/prism-line-numbers.min.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/prismjs@1.20.0/themes/prism-okaidia.min.css" rel="stylesheet"/>
    <link href="https://cdn.jsdelivr.net/npm/prismjs@1.20.0/plugins/line-numbers/prism-line-numbers.min.css" rel="stylesheet"/>
</head>
<body>
    <div>
        <style>
            // Add custom styling to some of the elements
            body {
                font-size: 12px;
            }
            .co {
                padding-top: 0;
                border: none;
            }
            .er {
                font-family: Consolas,Monaco,'Andale Mono','Ubuntu Mono',monospace;
                font-weight: 700;
                font-size: 12px;
                background-color: #272822;
            }
            .item-text {
                color: white;
                margin-left: 10px;
            }
            .inputs {
                display: inline-flex;
            }
            .error-box {
                display: inline-flex;
                margin: 10px;
            }
            #content {
                border: 1px solid #e1e1e1;
                border-radius: 4px;
                font-size: 12px;
            }
            #resetButton {
                border: none;
                background-color: #3182ce;
                color: white;
            }
            #filter {
                width: 450px;
                color: white;
                background-color: #272822;
            }
            #filter::placeholder {
                color: white;
            }
            #errors {
                color: red;
                display: none;
                background-color: #272822;
                border: 1px solid #e1e1e1;
                border-radius: 4px;
                font-size: 16px;
                margin-bottom: 12px;
            }

            pre[class*=language-] {
                margin: 0 0;
            }

            /* Switch Styling */
            input[type=checkbox]{
                height: 0;
                width: 0;
                visibility: hidden;
            }
            label {
                cursor: pointer;
                text-indent: -9999px;
                width: 40px;
                height: 20px;
                background: grey;
                display: block;
                border-radius: 15px;
                position: relative;
            }
            label:after {
                content: '';
                position: absolute;
                top: 3px;
                left: 3px;
                width: 15px;
                height: 15px;
                background: #fff;
                border-radius: 10px;
                transition: 0.3s;
            }
            input:checked + label {
                background: #3182ce;
            }
            input:checked + label:after {
                left: calc(100% - 5px);
                transform: translateX(-100%);
            }
            label:active:after {
                width: 20px;
            }
            /* Switch Styling End */
        </style>
        <div>
            <p id="content"></p>
        </div>
        <div id="errors"></div>
        <div>
            <input id="filter" type="text" placeholder="Example query: $..name.first[0]">
        </div>
        <div class="inputs">
            <button id="resetButton">Reset</button>
            <div class="error-box">
                <input id="showErrors" type="checkbox" value="1"/><label for="showErrors">Toggle</label>
                <span class="item-text">Show Evaluation Errors</span>
            </div>
        </div>
    </div>
</body>
</html>

<script>
pm.getData( (error, value) => {
    // Configure custom parsing here:
    // Need to parse data and errors field, since API gateway requires body to return stringified json
    if ('data' in value) {
        value['data'] = JSON.parse(value['data'])
    }
    const extractedData = jsonpath.query(value, '$');

    // Initial parse
    $(function() {
        try {
            let initialData = jsonpath.query(extractedData, '$[0]');
            $("#content, #errors").empty();
            $("#content").append("<pre class='pr line-numbers'><code class='co language-json'>" + JSON.stringify(initialData, null, 4) + "</code></pre>");
        } catch (err) {
            console.info(err);
            $("#errors").empty();
            $("#errors").append("<pre><code class='er co'>" + err + "</code></pre>");
        }
        Prism.highlightAll();
    });

    // Parse after every query modification
    $(function() {
        $('#filter').keyup(function() {
            try {
                let filteredData = jsonpath.query(extractedData, $(this).val());
                $("#content, #errors").empty();
                $("#content").append("<pre class='pr line-numbers'><code class='co language-json'>" + JSON.stringify(filteredData, null, 4) + "</code></pre>");
            } catch (err) {
                console.info(err);
                $("#errors").empty();
                $("#errors").append("<pre><code class='er co'>" + err + "</code></pre>");
            }
            Prism.highlightAll();
        });
    });

    // Reset
    $( "#resetButton" ).click(function() {
        $("#content, #errors").empty();
        $("#filter").val('');
        $("#content").append("<pre class='pr line-numbers'><code class='co language-json'>" + JSON.stringify(extractedData, null, 4) + "</code></pre>");
        Prism.highlightAll();
    })
})

$(function() {
  $("#showErrors").on("click",function() {
    $("#errors").toggle(this.checked);
  });
});
</script>`

// -------------------------
// - Bind data to template -
// -------------------------

// Set the visualizer template
pm.visualizer.set(template, res);
