import React from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';


class Cloud extends React.Component {

    componentDidUpdate() {
        document.getElementsByClassName('word-cloud')[0].innerHTML = '';
        generateWordCloud(document.getElementsByClassName('word-cloud')[0], this.props.value, 1000, 200);
      }

    render() {

        return (
            <div className="word-cloud"></div>
        )
    }
}

export default Cloud;


function generateWordCloud(element, text, width, height) {
    const fill = d3.scale.category20b();
    let words = [],
        scale = 1,
        fontSize;

    let unicodePunctuationRe = "!-#%-*,-/:;?@\\[-\\]_{}��";
    let stopWords = /^(i|me|my|myself|we|us|our|ours|ourselves|you|your|yours|yourself|yourselves|he|him|his|himself|she|her|hers|herself|it|its|itself|they|them|their|theirs|themselves|what|which|who|whom|whose|this|that|these|those|am|is|are|was|were|be|been|being|have|has|had|having|do|does|did|doing|will|would|should|can|could|ought|i'm|you're|he's|she's|it's|we're|they're|i've|you've|we've|they've|i'd|you'd|he'd|she'd|we'd|they'd|i'll|you'll|he'll|she'll|we'll|they'll|isn't|aren't|wasn't|weren't|hasn't|haven't|hadn't|doesn't|don't|didn't|won't|wouldn't|shan't|shouldn't|can't|cannot|couldn't|mustn't|let's|that's|who's|what's|here's|there's|when's|where's|why's|how's|a|an|the|and|but|if|or|because|as|until|while|of|at|by|for|with|about|against|between|into|through|during|before|after|above|below|to|from|up|upon|down|in|out|on|off|over|under|again|further|then|once|here|there|when|where|why|how|all|any|both|each|few|more|most|other|some|such|no|nor|not|only|own|same|so|than|too|very|say|says|said|shall)$/,
        punctuation = new RegExp("[" + unicodePunctuationRe + "]", "g"),
        wordSeparators = /[\s\u3031-\u3035\u309b\u309c\u30a0\u30fc\uff70]+/g,
        discard = /^(@|https?:|\/\/)/;    

    const layout = cloud()
        .timeInterval(10)
        .size([width, height])
        .fontSize(function(d) {return fontSize(+d.value); })
        .text(function(d) {return d.key; })
        .on("end", function (data) {
            words = data;
        
            var text = vis.selectAll("text")
            .data(words, function(d) { return d.text.toLowerCase(); });
        
            text.transition()
                .duration(10)
                .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
                .style("font-size", function(d) { return d.size + "px"; });
            text.enter().append("text")
                .attr("text-anchor", "middle")
                .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
                .style("font-size", function(d) { return d.size + "px"; })
                .on("click", function(d) {
                    // show something
                    console.log(d);
                })
                .style("opacity", 1e-6)
                .transition()
                .duration(10)
                .style("opacity", 1);
            text.style("font-family", function(d) { return d.font; })
                .style("fill", function(d) { return fill(d.text.toLowerCase()); })
                .text(function(d) { return d.text; });
                var exitGroupNode;
        
                    var exitGroup = background.append("g")
                        .attr("transform", vis.attr("transform"));
                        exitGroupNode = exitGroup.node();
            text.exit().each(function() {
                exitGroupNode.appendChild(this);
            });
            exitGroup.transition()
                .duration(10)
                .style("opacity", 1e-6)
                .remove();
        
        
                vis.transition()
                .delay(10)
                .duration(7)
                .attr("transform", "translate(" + [width >> 1, height >> 1] + ")scale(" + scale + ")");    
        });

    const svg = d3.select(element).append("svg")
        .attr("id", "group0Svg")
        .attr("width", width)
        .attr("height", height);
    
    const background = svg.append("g"),
        vis = svg.append("g")
        .attr("id", "group0g")
        .attr("transform", "translate(" + [width >> 1, height >> 1] + ")");                

    if (text) {
        let tags = {};
        let cases = {};
        text.split(wordSeparators).forEach(function(word) {
          if (discard.test(word)) return;
          word = word.replace(punctuation, "");
          if (stopWords.test(word.toLowerCase())) return;
          word = word.substr(0, 30);
          cases[word.toLowerCase()] = word;
          tags[word = word.toLowerCase()] = (tags[word] || 0) + 1;
        });
        tags = d3.entries(tags).sort(function(a, b) { return b.value - a.value; });
        tags.forEach(function(d) { d.key = cases[d.key]; });
        layout
            .font("Impact");
        fontSize = d3.scale["log"]().range([15, 50]);
        if (tags.length) fontSize.domain([+tags[tags.length - 1].value || 1, +tags[0].value]);
        words = [];
        layout.stop().words(tags).start();
    }
}