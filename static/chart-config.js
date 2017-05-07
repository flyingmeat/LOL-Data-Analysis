/* Data Processing */
if (ctData.champion === undefined) {
  // TODO
}

var prepareList = function(isLeader) {
  var result = [];

  if (isLeader) {
    for (var i = 0; i < 8; i++) {
      result.push(ctData.champion[i].name);
    }
  } else {
    for (var i = ctData.champion.length - 8; i < ctData.champion.length; i++) {
      result.push(ctData.champion[i].name);
    }
  }

  return result;
};

var prepareData = function(index, isLeader) {
  var result = [];

  if (isLeader) {
    for (var i = 0; i < 8; i++) {
      result.push(ctData.champion[i].data[index]);
    }
  } else {
    for (var i = ctData.champion.length - 8; i < ctData.champion.length; i++) {
      result.push(ctData.champion[i].data[index]);
    }
  }

  return result;
};

// 1. win rate
ctData.champion.sort(function(a, b) {
  b.data[0] - a.data[0];
});

var winRateLeaderList, winRateLeaderData, winRateBottomList, winRateBottomData;
winRateLeaderList = prepareList(true);
winRateLeaderData = prepareData(0, true);
winRateBottomList = prepareList(false);
winRateBottomData = prepareData(0, false);

// 2. first blood rate
ctData.champion.sort(function(a, b) {
  b.data[1] - a.data[1];
});

var fbRateLeaderList, fbRateLeaderData, fbRateBottomList, fbRateBottomData;
fbRateLeaderList = prepareList(true);
fbRateLeaderData = prepareData(1, true);
fbRateBottomList = prepareList(false);
fbRateBottomData = prepareData(1, false);

// 3. ban rate
ctData.ban_rate.sort(function(a, b) {
  b.data[0] - a.data[0];
});

var banRateLeaderList = [], banRateLeaderData = [], banRateBottomList = [], banRateBottomData = [];

for (var i = 0; i < 8; i++) {
  banRateLeaderList.push(ctData.ban_rate[i].name);
  banRateLeaderData.push(ctData.ban_rate[i].data[0]);
}

for (var i = ctData.ban_rate.length - 8; i < ctData.ban_rate.length; i++) {
  banRateBottomList.push(ctData.ban_rate[i].name);
  banRateBottomData.push(ctData.ban_rate[i].data[0]);
}

// 4. pick rate
ctData.champion.sort(function(a, b) {
  b.data[6] - a.data[6];
});

var pickRateLeaderList, pickRateLeaderData, pickRateBottomList, pickRateBottomData;
pickRateLeaderList = prepareList(true);
pickRateLeaderData = prepareData(6, true);
pickRateBottomList = prepareList(false);
pickRateBottomData = prepareData(6, false);

// 5. quadra kills count
ctData.champion.sort(function(a, b) {
  b.data[6] - a.data[6];
});

var pickRateLeaderList, pickRateLeaderData, pickRateBottomList, pickRateBottomData;
pickRateLeaderList = prepareList(true);
pickRateLeaderData = prepareData(6, true);
pickRateBottomList = prepareList(false);
pickRateBottomData = prepareData(6, false);

// 6. penta kills count


/* Team Data */
// Team left-chart-1
var teamBarChart1 = new Chart(document.getElementById("team-left-chart-1"), {
  type: 'bar',
  data: {
    labels: ["First Blood", "First Tower", "First Inhibitor", "First Baron"],
    datasets: [{
      label: 'Winner Team',
      data: ctData.factor[0].data.slice(0, 4),
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255,99,132,1)",
      borderWidth: 2
    }, {
      label: 'Loser Team',
      data: ctData.factor[1].data.slice(0, 4),
      backgroundColor: "rgba(69, 183, 205, 0.2)",
      borderColor: "rgba(69, 183, 205, 1)",
      borderWidth: 2
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});

// Team right-chart-1
var teamBarChart2 = new Chart(document.getElementById("team-right-chart-1"), {
  type: 'horizontalBar',
  data: {
    labels: ["Dragon Kills", "Baron Kills"],
    datasets: [{
      label: 'Winner Team',
      data: ctData.factor[0].data.slice(4),
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255,99,132,1)",
      borderWidth: 2
    }, {
      label: 'Loser Team',
      data: ctData.factor[1].data.slice(4),
      backgroundColor: "rgba(69, 183, 205, 0.2)",
      borderColor: "rgba(69, 183, 205, 1)",
      borderWidth: 2
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});

// Team left-chart-2
var teamDoughnutChart1 = new Chart(document.getElementById("team-left-chart-2"), {
  type: 'doughnut',
  data: {
    labels: ["Bronze", "Silver", "Gold", "Platinum", "Diamond"],
    datasets: [{
      backgroundColor: ["#45b7cd", "#ff6384", "#ff8e72", "#E377C2", "#9467BD", "#66AA00", "#3366CC", "#8C564B"],
      data: [0.05, 0.11, 0.27, 0.35, 0.22]
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false
  }
});

// Team right-chart-2
var teamPieChart2 = new Chart(document.getElementById("team-right-chart-2"), {
  type: 'pie',
  data: {
    labels: ["Blue team win rate", "Purple team win rate"],
    datasets: [{
      backgroundColor: [
        "#5AB9EC",
        "#9b59b6"
      ],
      data: [ctData.purple_vs_blue[0].data, ctData.purple_vs_blue[1].data]
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false
  }
});

/* Leader Data */
// Leader left-chart-1
var leaderBarChart1 = new Chart(document.getElementById("leader-left-chart-1"), {
  type: 'bar',
  data: {
    labels: winRateLeaderList,
    datasets: [{
      label: 'Win Rate',
      data: winRateLeaderData,
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      borderColor: "rgba(255,99,132,1)",
      borderWidth: 2
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          suggestedMin: 0.495 // minimum will be 0, unless there is a lower value
        }
      }]
    }
  }
});

// Leader right-chart-1
var leaderBarChart2 = new Chart(document.getElementById("leader-right-chart-1"), {
  type: 'bar',
  data: {
    labels: fbRateLeaderList,
    datasets: [{
      label: 'First Blood Rate',
      data: fbRateLeaderData,
      backgroundColor: "rgba(90, 185, 236, 0.5)",
      borderColor: "rgba(90, 185, 236, 1)",
      borderWidth: 2
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          suggestedMin: 0.495 // minimum will be 0, unless there is a lower value
        }
      }]
    }
  }
});

// Leader left-chart-2
var leaderBarChart3 = new Chart(document.getElementById("leader-left-chart-2"), {
  type: 'bar',
  data: {
    labels: banRateLeaderList,
    datasets: [{
      label: 'Ban Rate',
      data: banRateLeaderData,
      backgroundColor: "rgba(255, 142, 114, 0.5)",
      borderColor: "rgba(255, 142, 114, 1)",
      borderWidth: 2
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          suggestedMin: 0.495 // minimum will be 0, unless there is a lower value
        }
      }]
    }
  }
});

// Leader right-chart-2
var leaderBarChart4 = new Chart(document.getElementById("leader-right-chart-2"), {
  type: 'bar',
  data: {
    labels: pickRateLeaderList,
    datasets: [{
      label: 'Pick Rate',
      data: pickRateLeaderData,
      backgroundColor: "rgba(148, 103, 189, 0.5)",
      borderColor: "rgba(148, 103, 189, 1)",
      borderWidth: 2
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          suggestedMin: 0.495 // minimum will be 0, unless there is a lower value
        }
      }]
    }
  }
});

// Leader left-chart-3
var leaderBarChart5 = new Chart(document.getElementById("leader-left-chart-3"), {
  type: 'bar',
  data: {
    labels: ["Vi", "Galio", "Velkoz", "Rammus", "Anivia", "Twitch", "Janna", "Shaco"],
    datasets: [{
      label: 'Quadra Kills Counts',
      data: [0.545, 0.539, 0.537, 0.533, 0.532, 0.532, 0.529, 0.527],
      backgroundColor: "rgba(57, 214, 73, 0.5)",
      borderColor: "rgba(57, 214, 73, 1)",
      borderWidth: 2
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          suggestedMin: 0.495 // minimum will be 0, unless there is a lower value
        }
      }]
    }
  }
});

// Leader right-chart-3
var leaderBarChart6 = new Chart(document.getElementById("leader-right-chart-3"), {
  type: 'bar',
  data: {
    labels: ["Vi", "Galio", "Velkoz", "Rammus", "Anivia", "Twitch", "Janna", "Shaco"],
    datasets: [{
      label: 'Penta Kills Counts',
      data: [0.545, 0.539, 0.537, 0.533, 0.532, 0.532, 0.529, 0.527],
      backgroundColor: "rgba(0, 116, 217, 0.5)",
      borderColor: "rgba(0, 116, 217, 1)",
      borderWidth: 2
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          suggestedMin: 0.495 // minimum will be 0, unless there is a lower value
        }
      }]
    }
  }
});

/* Bottom Data */
// Bottom left-chart-1
var bottomBarChart1 = new Chart(document.getElementById("bottom-left-chart-1"), {
  type: 'bar',
  data: {
    labels: winRateBottomList,
    datasets: [{
      label: 'Win Rate',
      data: winRateBottomData,
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      borderColor: "rgba(255,99,132,1)",
      borderWidth: 2
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          suggestedMin: 0.495 // minimum will be 0, unless there is a lower value
        }
      }]
    }
  }
});

// Bottom right-chart-1
var bottomBarChart2 = new Chart(document.getElementById("bottom-right-chart-1"), {
  type: 'bar',
  data: {
    labels: fbRateBottomList,
    datasets: [{
      label: 'First Blood Rate',
      data: fbRateBottomData,
      backgroundColor: "rgba(90, 185, 236, 0.5)",
      borderColor: "rgba(90, 185, 236, 1)",
      borderWidth: 2
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          suggestedMin: 0.495 // minimum will be 0, unless there is a lower value
        }
      }]
    }
  }
});

// Bottom left-chart-2
var bottomBarChart3 = new Chart(document.getElementById("bottom-left-chart-2"), {
  type: 'bar',
  data: {
    labels: banRateBottomList,
    datasets: [{
      label: 'Ban Rate',
      data: banRateBottomData,
      backgroundColor: "rgba(255, 142, 114, 0.5)",
      borderColor: "rgba(255, 142, 114, 1)",
      borderWidth: 2
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          suggestedMin: 0.495 // minimum will be 0, unless there is a lower value
        }
      }]
    }
  }
});

// Bottom right-chart-2
var bottomBarChart4 = new Chart(document.getElementById("bottom-right-chart-2"), {
  type: 'bar',
  data: {
    labels: pickRateBottomList,
    datasets: [{
      label: 'Pick Rate',
      data: pickRateBottomData,
      backgroundColor: "rgba(148, 103, 189, 0.5)",
      borderColor: "rgba(148, 103, 189, 1)",
      borderWidth: 2
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          suggestedMin: 0.495 // minimum will be 0, unless there is a lower value
        }
      }]
    }
  }
});