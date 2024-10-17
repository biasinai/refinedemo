//     console.log(this.name);
//     update_visualization();
// });

// function update_visualization() {
//     category = "gender";
//     if (category.includes("gender")) {
//         fine_tuning = $('input[name=g_ft]:checked').val();
//         model = $('input[name=g_m]:checked').val();
//         if (fine_tuning === "newsqa") {
//             model += "_lm";
//         } else if (fine_tuning === "newsqa") {
//             model = "newsqa" + model;
//         }

//         model += "_gender";
//         if ($("#g_agg").is(":checked")) {
//             model += ".group_by_subj"
//         }
//         model += ".json";

//         console.log(model);
//         show_visualization('gender', model)
//     }

//     if (category === "ethnicity") {
//         fine_tuning = $('input[name=g_ft]:checked').val();
//         model = $('input[name=g_m]:checked').val();
//         if (fine_tuning === "newsqa") {
//             model += "_lm";
//         } else if (fine_tuning === "newsqa") {
//             model = "newsqa" + model;
//         }

//         model += "_ethnicity";
//         if ($("#g_agg").is(":checked")) {
//             model += ".group_by_act"
//         }
//         model += ".json";

//         console.log(model);
//         show_visualization('ethnicity', model)
//     }

//     if (category === "country") {
//         fine_tuning = $('input[name=g_ft]:checked').val();
//         model = $('input[name=g_m]:checked').val();
//         if (fine_tuning === "newsqa") {
//             model += "_lm";
//         } else if (fine_tuning === "newsqa") {
//             model = "newsqa" + model;
//         }

//         model += "_country";
//         if ($("#g_agg").is(":checked")) {
//             model += ".group_by_act"
//         }
//         model += ".json";

//         console.log(model);
//         show_visualization('nationality', model)
//     }

//     if (category === "religion") {
//         fine_tuning = $('input[name=g_ft]:checked').val();
//         model = $('input[name=g_m]:checked').val();
//         if (fine_tuning === "newsqa") {
//             model += "_lm";
//         } else if (fine_tuning === "newsqa") {
//             model = "newsqa" + model;
//         }

//         model += "_religion";
//         if ($("#g_agg").is(":checked")) {
//             model += ".group_by_act"
//         }
//         model += ".json";

//         console.log(model);
//         show_visualization('religion', model)
//     }
// }

// update_visualization("g_");
show_visualization('gender', 'BERT')
async function show_visualization(target, file) {
    // json_file = "https://unqover.apps.allenai.org/api/load?file=" + file;
    const first_names_list = [];
    const second_names_list = [];
    const jsonFilePath = '../web_json/BERT.json';
    // $.ajaxSetup({
    //     async: false
    // });
    let data;
    try {
        const response = await fetch(jsonFilePath);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        data = await response.json();
        console.log("Data received:", data); // Step 1: Log the data

        // Step 2: Check if data is an array
        if (Array.isArray(data)) {
            data.forEach(item => {
                // Your operation on each item
            });
        } else {
            console.error('Expected data to be an array but received:', typeof data);
            // Step 3: Adjust your code based on the actual structure of `data`
            // For example, if `data` is an object with an array property, you might do:
            // data.someArrayProperty.forEach(item => {
            //     // Your operation on each item
            // });
        }
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }


    function unique(arr) {
        var u = {}, a = [];
        for (var i = 0, l = arr.length; i < l; ++i) {
            if (!u.hasOwnProperty(arr[i])) {
                a.push(arr[i]);
                u[arr[i]] = 1;
            }
        }
        return a;
    }



    data.forEach(function (x, i) {
        first_names_list.push(x[0]);
        second_names_list.push(x[1]);
    });

    var first_names_unique = unique(first_names_list); // male/female
    var second_names_unique = unique(second_names_list); // attributes
    console.log(first_names_unique);
    console.log(second_names_unique);
    const random_value = Math.random();

    function static_random(seed) {
        var x = Math.sin(seed++) * 10000;
        return (x - Math.floor(x));
    }

    function get_random_color(seed) {
        function c(offset) {
            var hex = Math.floor(static_random(seed * random_value * 5 + offset * 3) * 256).toString(16);
            return ("0" + String(hex)).substr(-2); // pad with zero
        }

        return "#" + c(1) + c(2) + c(3);
    }

    var color = {};
    data.forEach(function (x, i) {
        const key = x[0];
        color[key] = get_random_color(key.length + i * 5)
    });

    const heigh = Math.max(first_names_unique.length, second_names_unique.length) * 20;
    console.log(data)
    d3.select("#visualization_gender").select("svg").remove();
    var svg = d3.select("#visualization_gender").append("svg").attr("width", "100%").attr("height", "100%").attr("viewBox", `0 0 960 ${heigh}` );
    var g = svg.append("g").attr("transform", "translate(90,50)");

    var bp = viz.bP()
        .data(data)
        .min(15)
        .pad(1)
        .height(heigh)
        .width(720)
        .barSize(70)
        .fill(d => color[d.primary]);

    g.call(bp);

    g.selectAll(".mainBars")
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);

    g.selectAll(".mainBars").append("text").attr("class", "label")
        .attr("x", d => (d.part === "primary" ? -30 : 30))
        .attr("y", d => +6)
        .text(d => d.key)
        .attr("text-anchor", d => (d.part === "primary" ? "end" : "start"));

    function mouseover(d) {
        bp.mouseover(d);
        console.log(d);
        g.selectAll(".mainBars")
            .select(".perc")
            .text(function (d) {
                return d3.format("0.0%")(d.percent)
            })
    }

    function mouseout(d) {
        bp.mouseout(d);
        g.selectAll(".mainBars")
            .select(".perc")
            .text(function (d) {
                return d3.format("0.0%")(d.percent)
            })
    }

    d3.select(self.frameElement).style("height", "800px");
}

// function plot_model_gender_ranks(file, metric) {
//     url = `https://unqover.apps.allenai.org/api/compute_model_occupations_ranks?file=${file}&metric=${metric}`;
//     $.getJSON(url, function (json) {
//         data = json;
//     });

//     if (metric === 'gamma') {
//         _name = 'Gamma'
//     } else {
//         _name = 'Eta'
//     }

//     var trace = {
//         x: data['x'],
//         y: data['y'],
//         name: _name,
//         type: 'bar'
//     };
//     var data = [trace];
//     var layout = {
//         colorway: ['#2389ff'],
//         barmode: 'group',
//         font: {
//             size: 10
//         },
//         yaxis: {
//             title: {
//                 text: 'Score',
//                 font: {
//                     size: 18,
//                 }
//             }
//         },
//         xaxis: {
//             automargin: true
//         },
//         annotations: [
//             {
//                 x: 0,
//                 y: -0.3,
//                 xref: 'x',
//                 yref: 'y',
//                 text: '♀️ association           ',
//                 showarrow: true,
//                 arrowhead: 1,
//                 ax: 90,
//                 ay: 0
//             },
//             {
//                 x: 29,
//                 y: -0.3,
//                 xref: 'x',
//                 yref: 'y',
//                 text: '           ♂️ association',
//                 showarrow: true,
//                 arrowhead: 1,
//                 ax: -90,
//                 ay: 0
//             }
//         ],
//             margin: {
//                 l: 60,
//                 r: 10,
//                 b: 70,
//                 t: 10,
//                 pad: 0
//             },
//     };
//     Plotly.newPlot('gender_ranks_plots_per_model', data, layout, {responsive: true});
// }

// $('input[name=gender_model_ranking_model], input[name=gender_model_ranking_ft], input[name=gender_model_ranking_metric]').change(function () {
//     model = $('input[name=gender_model_ranking_model]:checked').val();
//     ft = $('input[name=gender_model_ranking_ft]:checked').val();

//     if (ft === 'lm') {
//         file = `${model}_lm_gender`
//     } else if (ft === 'newsqa') {
//         file = `newsqa_${model}_gender`
//     } else {
//         file = `${model}_gender`;
//     }

//     metric = $('input[name=gender_model_ranking_metric]:checked').val();

//     plot_model_gender_ranks(file, metric);
// });

// plot_model_gender_ranks('bertbase_gender', 'gamma');

// function plot_model_ranks(file, metric) {
//     url = `https://unqover.apps.allenai.org/api/compute_model_ranks?file=${file}&metric=${metric}`;
//     $.getJSON(url, function (json) {
//         data = json;
//     });

//     if (metric === 'gamma') {
//         _name = 'Gamma'
//     } else {
//         _name = 'Eta'
//     }

//     var trace = {
//         x: data['x'],
//         y: data['y'],
//         name: _name,
//         type: 'bar'
//     };
//     var data = [trace];
//     var layout = {
//         colorway: ['#2389ff'],
//         barmode: 'group',
//         font: {
//             size: 12
//         },
//         yaxis: {
//             title: {
//                 text: 'Score',
//                 font: {
//                     size: 18,
//                 }
//             }
//         },
//         xaxis: {
//             automargin: true
//         },
//         margin: {
//                 l: 60,
//                 r: 10,
//                 b: 70,
//                 t: 10,
//                 pad: 0
//             },
//     };
//     Plotly.newPlot('ranks_plots_per_model', data, layout, {responsive: true});
// }