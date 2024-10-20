    // console.log(this.name);
// update_visualization();
const genderArticle = document.querySelector('#gender');
// console.log(genderArticle);
// Step 2: Find all radio inputs within this article
const genderRadios = genderArticle.querySelectorAll('input[type="radio"]');
console.log(genderRadios);
// Step 3: Add a 'click' event listener to each radio input
genderRadios.forEach(radio => {
    radio.addEventListener('click', handleRadioClick);
});

// Step 4: Define the event handler function
function handleRadioClick(event) {
    // Capture the value of the clicked radio input
    const selectedOption = event.target.value;
    
    // Update the visualization based on the selected option
    show_visualization('gender', selectedOption);
}

// document.querySelectorAll('input[name="gender_model"]').forEach((radio) => {
//     radio.addEventListener('change', function() {
//         // Step 2: Identify selected radio
//         const selectedModel = this.value;
//         console.log(selectedModel);
//         // Step 3: Fetch or define data based on selected model
//         // This is a placeholder; you'll need to replace it with actual data fetching or selection logic
//         let data;
//         switch (selectedModel) {
//             case 'BERT_gender_plot':
//                 data = 'BERT';
//                 break;
//             case 'llama7b_gender_plot':
//                 data = 'Llama7b';
//                 break;
//             case 'llama7b_chat_gender_plot':
//                 data = 'Llama7b-chat';
//                 break;
//             case 'RoBERTa_gender_plot':
//                 data = 'RoBERTa';
//                 break;
//             // Add cases for other models as necessary
//             default:
//                 data = 'BERT';
//         }

//         // Step 4: Update visualization
//         // This is a placeholder for updating the visualization. You might be setting innerHTML, drawing a chart, etc.
//         // document.getElementById('visualization_gender').innerHTML = `<p>${data}</p>`;
//     });
// });

// update_visualization("g_");
show_visualization('gender', 'BERT')
async function show_visualization(target, modelName) {
    // json_file = "https://unqover.apps.allenai.org/api/load?file=" + file;
    const first_names_list = [];
    const second_names_list = [];
    const jsonFilePath = 'assets/web_json/'+modelName+'.json';
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
        // console.log("Data received:", data); // Step 1: Log the data

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
    // console.log(first_names_unique);
    // console.log(second_names_unique);
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
    // console.log(data)
    d3.select("#visualization_gender").select("svg").remove();
    var svg = d3.select("#visualization_gender").append("svg").attr("width", "100%").attr("height", "100%").attr("viewBox", `0 0 1800 ${heigh + 80}`).style("display", "flex")
    .style("justify-content", "center")
    .style("align-items", "center");
    var svgWidth = document.querySelector("#visualization_gender svg").getBoundingClientRect().width;
    var contentWidth = 500; // This is the width of the content you're centering, adjust as needed
    var centerX = (svgWidth - contentWidth) / 2;
    var g1 = svg.append("g").attr("transform", "translate(250,50)");
    var bp1 = viz.bP()
        .data(data)
        .value(d => d[2])
        .min(5)
        .pad(5)
        .height(heigh)
        .width(550)
        .barSize(50)
        .fill(d => color[d.primary])
        .orient("vertical");

    g1.call(bp1); g1.append("text")
        .attr("x", -30).attr("y", -8)
        .style("text-anchor", "middle")
        .style("opacity", "0")
        .text("Primary");
    // g1.append("text")
    //     .attr("x", 250)
    //     .attr("y", -8).style("text-anchor", "middle")

    //     .text("Secondary");
    g1.append("text")
        .attr("x", 350).attr("y", -25)
        .style("text-anchor", "middle")
        .attr("class", "header")
        .style("font-size", "30px") 
        .text("Base");

    g1.selectAll(".mainBars")
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);

    g1.selectAll(".mainBars").append("text").attr("class", "label")
        .attr("x", d => (d.part == "primary" ? -60 : 130))
        .style("font-size", d => (d.part == "primary" ? "23px" : "17px"))
        .style("font-weight",d => (d.part == "primary" ? "bold" : "normal")) 
        .attr("y", d => +6)
        .text(d => d.key)
        .attr("text-anchor", d => (d.part == "primary" ? "end" : "middle"));
        

    g1.selectAll(".mainBars").append("text").attr("class", "perc")
        .attr("x", d => +110)
        .attr("y", d => +6)
        // .attr("transform", "scale(-1, 1)")
        // .text(function(d) { 
        //     return d.part == "primary" ? d3.format("0.2%")(d.percent) : '';
        //   })
        .style("opacity", d => (d.part == "primary" ? "1" : "0")) // Adjust opacity based on condition

        .text(function (d) { return d3.format("0.2%")(d.percent) })
        .attr("text-anchor", d => (d.part == "primary" ? "end" : "start"));
    // __________________________

    var g2 = svg.append("g").attr("transform", "translate(1550,50)  scale(-1, 1)");
    var bp2 = viz.bP()
        .data(data)
        .value(d => d[3])
        .min(5)
        .pad(5)
        .height(heigh)
        .width(550)
        .barSize(70)
        .fill(d => color[d.primary])
        .orient("vertical");

    g2.call(bp2); g2.append("text")
        .attr("x", -50).attr("y", -8)
        .attr("transform", "scale(-1, 1)")
        .style("text-anchor", "middle")
        .text("");
    g2.append("text")
        .attr("transform", "scale(-1, 1)")
        .attr("x", 250)
        .style("opacity", "0")
        .attr("y", -8).style("text-anchor", "middle")
        .text("");
    g2.append("text")
        .attr("transform", "scale(-1, 1)")
        .attr("x", -350).attr("y", -25)
        .style("text-anchor", "middle")
        .style("font-size", "30px")
        .attr("class", "header")
        .text("Refine");

    g2.selectAll(".mainBars")
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);

    g2.selectAll(".mainBars").append("text").attr("class", "label")
        // .attr("x", d => (d.part == "primary" ? -20 : 20))
        .attr("x", d => +130)
        // .attr("y", d => )
        .text(d => d.key)
        .style("font-weight",d => (d.part == "primary" ? "bold" : "normal")) 
        .style("font-size", d => (d.part == "primary" ? "23px" : "17px"))
        .attr("transform", "scale(-1, 1)")
        .style("opacity", d => (d.part == "primary" ? "1" : "0")) // Adjust opacity based on condition

        .attr("text-anchor", d => (d.part == "primary" ? "end" : "start"));

    g2.selectAll(".mainBars").append("text").attr("class", "perc")
        // .attr("x",d=>(d.part=="primary"? 200:-200))
        .attr("x", d => -80)
        .attr("y", d => +6)
        .attr("transform", "scale(-1, 1)")
        // .text(function(d) { 
        //     return d.part == "primary" ? d3.format("0.2%")(d.percent) : '';
        //   })
        .style("opacity", d => (d.part == "primary" ? "1" : "0")) // Adjust opacity based on condition

        .text(function (d) { return d3.format("0.2%")(d.percent) })
        .attr("text-anchor", d => (d.part == "primary" ? "end" : "start"));

    function mouseover(d) {
        bp1.mouseover(d);
        g1.selectAll(".mainBars")
            .select(".perc")
            .text(function (d) { return d3.format("0.2%")(d.percent) });
        bp2.mouseover(d);
        g2.selectAll(".mainBars")
            .select(".perc")
            .text(function (d) { return d3.format("0.2%")(d.percent) });
    }

    function mouseout(d) {
        bp1.mouseout(d);
        g1.selectAll(".mainBars")
            .select(".perc")
            .text(function (d) { return d3.format("0.2%")(d.percent) });
        bp2.mouseout(d);
        g2.selectAll(".mainBars")
            .select(".perc")
            .text(function (d) { return d3.format("0.2%")(d.percent) });
    }
}

