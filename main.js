var width = 1500,
  height = 750,
  padding = 25;
var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);
var heatmapgroup = svg.append("g")
  .attr("class","chart")
  .attr("transform", "translate(400, 50)"); // heatmap
var sgroup = svg.append("g") // scatterplot
  .attr("class","scatterplot")
  .attr("transform", "translate(1100, 125)");
var dotgroup = svg.append("g") // scatterplot
  .attr("class","dots")
  .attr("transform", "translate(25, 325)");
var toolgroup = svg.append("g")
  .attr("transform", "translate(25, 325)");
var itemSize = 12,
  cellSize = itemSize - 1;



var chartWidth = 300;
var chartHeight = 300;

var state;
var xScaleS, yScaleS;

var state = {
    x: 'Popularity',
    y: 'valence',
    lastWasX: false
};

var xAxisS = sgroup.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate('+[0, chartHeight]+')');
var yAxisS = sgroup.append('g')
    .attr('class', 'y axis');
var xLabel = sgroup.append('text')
    .attr('class', 'x label')
    .attr('transform', 'translate('+[0, chartHeight+padding]+')');
var yLabel = sgroup.append('text')
    .attr('class', 'y label')
    .attr('transform', 'translate('+[-padding, 0]+')');

var music;
var keys;

var displayArtist = svg.append("g")
  .attr("class","infobox")
  .attr("transform", "translate(25, 65)");

displayArtist.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 325)
            .attr("height", 250)
            .attr("rx", 10)
            .attr("stroke-width", 1)
            .attr("stroke", "#000000")
            .style("fill", "lightgreen");

function bubbles() {
  console.log(keys);
  var x = toolgroup
  .selectAll('circle')
    .data(keys)
  .enter()
    .append('circle')
     .attr("class","tool").attr("cx", function(d,i) {
      return 37 +Math.floor(i/4)*75;
    })
    .attr("cy", function(d,i) {
      return 50 + (i%4)*75;
    })
    .attr("r", 37)
    .attr("fill","white")
    .attr("stroke-width", 1)
    .attr("stroke", "#000000")
    .on("click", function(d) {
      updateData(d.id, this);
    });
  toolgroup.selectAll('text')
    .data(keys)
  .enter()
    .append('text')
    .attr("x", function(d,i) {
      return 37 + Math.floor(i/4)*75;
    })
    .attr("y", function(d,i) {
      return 50 + (i%4)*75;
    })
    .attr('font-size', '10px')
    .attr('text-anchor', 'middle')
    .text(function(d) {return d.id;});

    toolgroup.selectAll(".tool")
      .attr('fill', function(d) {
        console.log(d);
        if (state.lastWasX) {
          if (d.id==state.x) return "limegreen";
          if (d.id==state.y) return "lightskyblue";
        } else {
          if (d.id==state.y) return "lightskyblue";
          if (d.id==state.x) return "limegreen";
        }
        return "white"
      });
}

function wrap(text, width) {
text.each(function () {
  var text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.1, // ems
      x = text.attr("x"),
      y = text.attr("y"),
      dy = 0, //parseFloat(text.attr("dy")),
      tspan = text.text(null)
                  .append("tspan")
                  .attr("x", x)
                  .attr("y", y)
                  .attr("dy", dy + "em");
  while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan")
                      .attr("x", x)
                      .attr("y", y)
                      .attr("dy", ++lineNumber * lineHeight + dy + "em")
                      .text(word);
      }
  }
});
}

var colorX = d3.scaleLinear()
  .domain([-1,1])
  .range(['white', 'limegreen']);

var colorY = d3.scaleLinear()
  .domain([-1,1])
  .range(['white', 'lightskyblue']);

var normalizeX = d3.scaleLinear()
  .range([-1,1]);

var normalizeY = d3.scaleLinear()
  .range([-1,1]);

d3.csv('billboard.csv',
    function(row) {
      return {
        'Artist': row['Artist'],
        'Song': row['Song'],
        'Year': row['Year'],
        'url': row['url'],
        'Rank': row['Rank'],
          'Popularity': +row['Popularity'],
          'danceability': +row['danceability'],
          'energy': row['energy'],
          'instrumentalness': +row['instrumentalness'],
          'loudness': +row['loudness'],
          'speechiness': +row['speechiness'],
          'valence': +row['valence'],
          'LOVE': +row['LOVE'],
          'SEXUAL': +row['SEXUAL'],
          'PROFANITY': +row['PROFANITY'],
          'MONEY': +row['MONEY'],
          'DRUGS': +row['ALCOHOL/DRUG USAGE'],
          'HAPPY/GOOD': +row['HAPPY/GOOD'],
          'SAD/BAD': +row['SAD/BAD'],
          'HEART': +row['HEART'],
          'DEATH': +row['DEATH']
      };
    },
    function ( dataset ) {
      music = dataset;

      keysarray = Object.keys(music[0]);
      console.log(keysarray);
      keys = [];
      for (i in keysarray) {
        keys.push({id: keysarray[i]});
      }
      keys.splice(0,5);

      console.log(keys);

      bubbles();

      var x_elements = d3.set(music.map(function( item ) { return item.Year; } )).values(),
          y_elements = d3.set(music.map(function( item ) { return item.Rank; } )).values();

      var xScale = d3.scaleLinear()
          .domain(d3.extent(x_elements))
          .range([0, x_elements.length * itemSize]);

      var xAxis = d3.axisTop(xScale).tickFormat(function (d) {
          return d;
      });

      var yScale = d3.scaleLinear()
          .domain(d3.extent(y_elements))
          .range([0, y_elements.length * itemSize/2]);

      var yAxis = d3.axisLeft(yScale).tickFormat(function (d) {
          return d;
      });


      var color = d3.scaleBivariate();

      heatmapgroup.selectAll('rect')
          .data(music)
        .enter().append('rect')
          .attr('class', 'cell')
          .attr('width', cellSize)
          .attr('height', cellSize/2)
          .attr('y', function(d) { return yScale(d.Rank); })
          .attr('x', function(d) { return xScale(d.Year); })
          .attr('fill', function(d) {
                return color([d[state.x],d[state.y]]);
              })
          .on('click', function(d){return window.open(d.url);})
          .on('mouseover', function(d) {
     //console.log(d.Artist, d.Song);
     displayArtist.append("text")
       .attr("x", 25)
       .attr("y", 20)
       .text("Song: "+ d.Song.toUpperCase())
       .call(wrap, 275)
     displayArtist.append("text")
       .attr("x", 25)
       .attr("y", 55)
       .text("Artist: "+ d.Artist.toUpperCase())
       .call(wrap, 275)
     displayArtist.append("text")
       .attr("x", 25)
       .attr("y", 90)
       .text("Popularity: "+ d.Popularity)
     displayArtist.append("text")
       .attr("x", 25)
       .attr("y", 115)
       .text("Danceability: "+ d.danceability)
     displayArtist.append("text")
       .attr("x", 25)
       .attr("y", 140)
       .text("Energy: "+ d.energy)
     displayArtist.append("text")
       .attr("x", 25)
       .attr("y", 165)
       .text("Instrumentalness: "+ d.instrumentalness)
     displayArtist.append("text")
       .attr("x", 25)
       .attr("y", 190)
       .text("Loudness: "+ d.loudness)
     displayArtist.append("text")
       .attr("x", 25)
       .attr("y", 215)
       .text("Speechiness: "+ d.speechiness)
     displayArtist.append("text")
       .attr("x", 25)
       .attr("y", 240)
       .text("Valence: "+ d.valence)
     d3.select(this)
       .transition()
       .style("stroke-width", 2)
       .style("stroke", "#222222");
     })
        .on('mouseout', function(d) {
     displayArtist.selectAll("text").remove()
     d3.select(this)
       .transition()
       .style("stroke-width", 0)
       .style("stroke", "#FFFFFF");
     });

      heatmapgroup.append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .selectAll('text')
          .attr('font-weight', 'normal');
      var xAxisTranslate = height/2 + 10;

      heatmapgroup.append("g")
          .attr("class", "x axis")
          .call(xAxis)
          .selectAll('text')
          .attr('font-weight', 'normal')
          .style("text-anchor", "start")
          .attr("dx", ".8em")
          .attr("dy", ".5em")
          .attr("transform", function (d) {
              return "rotate(-65)";
          });

          heatmapgroup.append("text")
                .attr("transform", "translate(305,-40)")
                .style("text-anchor", "middle")
                .text("Year");

    heatmapgroup.append("text")
                .attr("transform", 'translate(-30,305)rotate(-90)')
                .style("text-anchor", "middle")
                .text("Billboard Top 100 Rank");

    sgroup.append("text")
                .attr('class', 'xlabel')
                .text(state.x)
                .attr("transform", "translate(115,335)");

    sgroup.append("text")
                .attr('class', 'ylabel')
                .text(state.y)
                .attr("transform","translate(-35,185)rotate(-90)");

      xScaleS = d3.scaleLinear()
              .range([0, chartWidth]);

      yScaleS = d3.scaleLinear()
              .range([chartHeight, 0]);

      domainMap = {};

      music.columns.forEach(function(column) {
          domainMap[column] = d3.extent(dataset, function(data_element){
              return data_element[column];
          });
      });

    // Adding legend to heatmap

        var linear = d3.scaleLinear()
            .domain([0,10])
            .range(["rgb(46, 73, 123)", "rgb(71, 187, 94)"]);

        var svg = d3.select("svg");

        svg.append("g")
            .attr("class", "legendLinear")
            .attr("transform", "translate(1100,500)");

        var legendLinear = d3.legendColor()
            .shapeWidth(30)
            .cells(8)
            .orient('horizontal')
            .scale(colorX);

        svg.select(".legendLinear")
            .call(legendLinear);

        // Add a title to the legend
        svg.append("text")
            .attr("class", "LegendtitleX")
            .style("font-size", "15px")
            .style("font-family", "Avenir")
            .style("fill", "#949992")
            .attr("transform", "translate(1200,550)")
            .text(state.x);



        var linear = d3.scaleLinear()
            .domain([0,10])
            .range(["rgb(46, 73, 123)", "rgb(71, 187, 94)"]);

        var svg = d3.select("svg");

        svg.append("g")
            .attr("class", "legendLinear2")
            .attr("transform", "translate(1100,590)");

        var legendLinear2 = d3.legendColor()
            .shapeWidth(30)
            .cells(8)
            .orient('horizontal')
            .scale(colorY);

        svg.select(".legendLinear2")
            .call(legendLinear2);
        // Add a title to the legend

        svg.append("text")
            .attr("class", "LegendtitleY")
            .style("font-size", "15px")
            .style("font-family", "Avenir")
            .style("fill", "#949992")
            .attr("transform", "translate(1210,650)")
            .text(state.y);


      updateChart();

});



function updateChart() {
  if (state.y == null || state.x == null)
    return;
  yScaleS.domain(domainMap[state.y]).nice();
  xScaleS.domain(domainMap[state.x]).nice();
  xAxisS.transition()
      .duration(750)
      .call(d3.axisBottom(xScaleS));
  yAxisS.transition()
      .duration(750)
      .call(d3.axisLeft(yScaleS));

  sgroup.selectAll('.x label')
    .text(state.x);
  sgroup.selectAll('.y label')
    .text(state.x);

  var dots = sgroup.selectAll('.dot')
      .data(music);

  var dotsEnter = dots.enter()
      .append('g')
      .attr('class', 'dot')
      .on('mouseover', function(d) {
          var hovered = d3.select(this);
          hovered.select('text')
              .style('visibility', 'visible');
          hovered.select('circle')
              .style('stroke-width', 2)
              .style('stroke', '#333')
              .style('fill', 'orange')
      })
      .on('mouseout', function(d) {
          var hovered = d3.select(this);
          hovered.select('text')
              .style('visibility', 'hidden');
          hovered.select('circle')
              .style('stroke-width', 0)
              .style('stroke', 'none')
              .style('fill', 'steelblue')
          });

          dotsEnter.append('circle')
              .attr('r', 2);

          dotsEnter.append('text')
              .attr('y', -10)
              .text(function(d) {
                  return d.name;
              });

          dots.merge(dotsEnter)
              .transition()
              .duration(750)
              .attr('transform', function(d) {
                  var tx = xScaleS(d[state.x]);
                  var ty = yScaleS(d[state.y]);
                  return 'translate('+[tx, ty]+')';
              });
}

function updateData (field, obj) {
  if (field == state.x) {
    state.x = null;
    state.lastWasX = true;
    var color = d3.scaleBivariate();
    if (state.y == null) {
      heatmapgroup.selectAll('.cell')
        .attr('fill', 'white');
    } else {
      heatmapgroup.selectAll('.cell')
        .attr('fill', function(d) {
          return color([null,d[state.y]]);
        });
    }
  } else if (field == state.y) {
    state.y = null;
    state.lastWasX = false;
    var color = d3.scaleBivariate();
    if (state.x == null) {
      heatmapgroup.selectAll('.cell')
        .attr('fill', 'white');
    } else {
      heatmapgroup.selectAll('.cell')
        .attr('fill', function(d) {
          return color([d[state.x],null]);
        });
    }
  } else if (state.y == null && state.x != null) {
    state.y = field;
    state.lastWasX = false;
    var color = d3.scaleBivariate();
    heatmapgroup.selectAll('.cell')
      .attr('fill', function(d) {
        return color([d[state.x],d[state.y]]);
      });
  } else if (state.x == null && state.y != null) {
    state.x = field;
    state.lastWasX = true;
    var color = d3.scaleBivariate();
    heatmapgroup.selectAll('.cell')
      .attr('fill', function(d) {
        return color([d[state.x],d[state.y]]);
      });
  } else if (!state.lastWasX) {
    state.x = field;
    state.lastWasX = true;
    var color = d3.scaleBivariate();
    if (state.y == null) {
      heatmapgroup.selectAll('.cell')
        .attr('fill', function(d) {
          return color([d[state.x],null]);
        });
    } else {
      heatmapgroup.selectAll('.cell')
        .attr('fill', function(d) {
          return color([d[state.x],d[state.y]]);
        });
    }
  } else {
    state.y = field;
    state.lastWasX = false;
    var color = d3.scaleBivariate();
    if (state.x == null) {
      heatmapgroup.selectAll('.cell')
        .attr('fill', function(d) {
          return color([null,d[state.y]]);
        });
    } else {
      heatmapgroup.selectAll('.cell')
        .attr('fill', function(d) {
          return color([d[state.x],d[state.y]]);
        });
    }
  }
  var svg = d3.select("svg");
  svg.selectAll(".xlabel")
    .text(state.x);
  svg.selectAll(".ylabel")
    .text(state.y);

  svg.selectAll(".LegendtitleX")
    .text(state.x);
  svg.selectAll(".LegendtitleY")
    .text(state.y);

  toolgroup.selectAll(".tool")
    .attr('fill', function(d) {
      console.log(d);
      if (state.lastWasX) {
        if (d.id==state.x) return "limegreen";
        if (d.id==state.y) return "lightskyblue";
      } else {
        if (d.id==state.y) return "lightskyblue";
        if (d.id==state.x) return "limegreen";
      }
      return "white"
    });
  updateChart();
}


d3.scaleBivariate = function() {
  function scaleBivariate(value) {
    if (value[0] == null) {
      var y = normalizeY(value[1]);
      return colorY(y);
    } else if (value[1] == null) {
      var x = normalizeX(value[0]);
      return colorX(x);
    } else {
      var x = normalizeX(value[0]);
      var y = normalizeY(value[1]);
      color.range([colorX(x), colorY(y)]);
      return color(y - x);
    }
  }
  normalizeX.domain(d3.extent(music, function( item ) { return item[state.x]; } ));
  normalizeY.domain(d3.extent(music, function( item ) { return item[state.y]; } ));
  var color = d3.scaleLinear()
      .domain([-1,1])
      .interpolate(d3.interpolateLab);
  return scaleBivariate;
}
