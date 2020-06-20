// Template for parsing JSON data retrieved by Postman
// Allows for parsing nested JSON strings, additionally implement JSONQuery for more custom parsing

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
            input::-webkit-input-placeholder { /* WebKit browsers */
                color:    #fff;
            }
            input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
                color:    #fff;
            }
            input::-moz-placeholder { /* Mozilla Firefox 19+ */
                color:    #fff;
            }
            input:-ms-input-placeholder { /* Internet Explorer 10+ */
                color:    #fff;
            }
            .co {
                padding-top: 0;
                border: none;
            }
            .er {
                background-color: #272822;
            }
            .item-text {
                font-family:courier;
                color:white;
            }
            #content {
                border: 1px solid #e1e1e1;
                border-radius: 4px;
                font-size: 12px;
            }
            #resetButton {
                border: none;
                background-color:#319795;
                color:white;
            }
            #filter {
                width:450px;
                color:white;
                background-color:#272822;
            }
            #errors {
                font-family:courier;
                color:red;
                display:none;
            }
        </style>
        <div>
            <p id="content"></p>
        </div>
            <div id="errors"></div>
        <div>
            <input id="filter" type="text" placeholder="Example query: $..name.first">
        </div>
        <div>
            <button id="resetButton">Reset</button>
            <input id="showErrors" type="checkbox" value="1"/>
            <span class="item-text">Show Evaluation Errors</span>
        </div>
    </div>
</body>
</html>

<script>
pm.getData( (error, value) => {
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
            $("#content").append("<pre class='line-numbers'><code class='co language-json'>" + JSON.stringify(initialData, null, 4) + "</code></pre>");
        } catch (err) {
            console.info(err);
            $("#errors").empty();
            $("#errors").append("<pre><code class='er co'>" + err + "</code></pre>");
        }
        Prism.highlightAll();
    });
    
    $(function() {
        $('#filter').keyup(function() {
            try {
                let filteredData = jsonpath.query(extractedData, $(this).val());
                $("#content, #errors").empty();
                $("#content").append("<pre class='line-numbers'><code class='co language-json'>" + JSON.stringify(filteredData, null, 4) + "</code></pre>");
            } catch (err) {
                console.info(err);
                $("#errors").empty();
                $("#errors").append("<pre><code class='er co'>" + err + "</code></pre>");
            }
            Prism.highlightAll();
        });
    });
    
    $( "#resetButton" ).click(function() {
        $("#content, #errors").empty();
        $("#filter").val('');
        $("#content").append("<pre class='line-numbers'><code class='co language-json'>" + JSON.stringify(extractedData, null, 4) + "</code></pre>");
        Prism.highlightAll();
    })
})

$(function() {
  $("#showErrors").on("click",function() {
    $("#errors").toggle(this.checked);
  });
});
</script>`

pm.visualizer.set(template, pm.response.json())
