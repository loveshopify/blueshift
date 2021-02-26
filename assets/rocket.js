var xmlns = "http://www.w3.org/2000/svg",
  xlinkns = "http://www.w3.org/1999/xlink",
  select = function(s) {
    return document.querySelector(s);
  },
  selectAll = function(s) {
    return document.querySelectorAll(s);
  },
  heroMessageArr = [
    "launching^creative ideas",
    "building^the future",
    "See you^soon!"
  ],
  heroLine0 = select(".heroLine0"),
  heroLine1 = select(".heroLine1"),
  display = select(".display"),
  rocketSVG = select(".rocketSVG"),
  smokeTail = select(".smokeTail"),
  rocketGroup = select(".rocketGroup"),
  rocketBody = select(".rocketBody"),
  rocketFlameContainer = select(".rocketFlameContainer"),
  rocketFlame = select(".rocketFlame"),
  stageWidth = 600,
  stageHeight = 600,
  numStars = 100,
  star = select(".star"),
  cloudGroup = select(".cloudGroup"),
  allClouds = selectAll(".cloudGroup circle"),
  starContainer = select(".starContainer"),
  starTl = new TimelineMax().timeScale(1),
  rocketFlameTl,
  cloudsTl = new TimelineMax().timeScale(1),
  message0Str = "buildStars();",
  message1Str = "buildRocketClouds();",
  message2Str = "launchRocket();",
  heroMessageCount = 0,
  numHeroMessages = heroMessageArr.length,
  displayInitPos = { x: 354, y: 415 },
  rocketGroupInitPos = { x: 245, y: 385 },
  cloudGroupInitPos = { x: 0, y: 80 },
  mainTl = new TimelineMax({ repeat: 2, repeatDelay: 2, paused: true }),
  readoutTl = new TimelineMax({ paused: true });

if (document.querySelector("svg") !== null) {
  TweenMax.set("svg", {
    visibility: "visible"
  });
}

if (document.querySelector(".rocketGroup") !== null) {
  TweenMax.set(rocketGroup, {
    x: rocketGroupInitPos.x,
    y: rocketGroupInitPos.y
  });
}

if (document.querySelector(".cloudGroup") !== null) {
  TweenMax.set(cloudGroup, {
    x: cloudGroupInitPos.x,
    y: cloudGroupInitPos.y
  });
}

if (document.querySelector(".display") !== null) {
  TweenMax.set(display, {
    x: displayInitPos.x,
    y: displayInitPos.y
  });
}

if (document.querySelector(".circle") !== null) {
  TweenMax.set("circle", {
    transformOrigin: "50% 50%"
  });
}

if (document.querySelector(".display") !== null) {
  TweenMax.set(display, {});
}

if (document.querySelector(".rocketFlame") !== null) {
  TweenMax.set([rocketFlame, rocketFlameContainer, smokeTail], {
    transformOrigin: "50% 0%"
  });
}

if (document.querySelector(".rocketFlameContainer") !== null) {
  TweenMax.set([rocketFlameContainer, smokeTail], {
    scale: 0
  });
}

function initMessage() {
  TweenMax.staggerTo(
    [heroLine0, heroLine1],
    1,
    {
      cycle: {
        text: function(i) {
          return heroMessageArr[heroMessageCount].split("^")[i];
        }
      },
      ease: Linear.easeNone
      //onComplete:launch
    },
    1,
    launch
  );
  //heroLine0.textContent = ()
  //heroLine1.textContent = (heroMessageArr[heroMessageCount].split('^')[1])
}

function createStars() {
  var starClone, tl;
  for (var i = 0; i < numStars; i++) {
    starClone = star.cloneNode(true);
    starContainer.appendChild(starClone);
    TweenMax.set(starClone, {
      attr: {
        cx: randomBetween(-stageWidth * 2, stageWidth * 2),
        cy: randomBetween(0, stageHeight),
        r: randomBetween(5, 20) / 10
      }
    });

    tl = new TimelineMax();
    tl.from(starClone, randomBetween(10, 30) / 10, {
      alpha: 0.03,
      //fill:'#000',
      repeat: -1,
      yoyo: true,
      repeatDelay: randomBetween(10, 40) / 10,
      ease: Linear.easeNone
    });

    //starTl.add(tl, 0);
  }
}

function createClouds() {
  var tl,
    origin = "",
    cx,
    cy;
  for (var i = 0; i < allClouds.length; i++) {
    TweenMax.set(allClouds[i % 10], {
      fill: "#B2E0E3"
    });
    TweenMax.set(allClouds[i % 30], {
      fill: "#C1E7E9"
    });

    cx = Number(allClouds[i].getAttribute("x"));
    cy = Number(allClouds[i].getAttribute("y"));
    origin = cx + 13 + " " + (cy + 13);
    //console.log(origin)
    TweenMax.set(allClouds[i], {
      //svgOrigin:origin
      //transformOrigin:'50% 50%'
    });

    tl = new TimelineMax();
    tl.fromTo(
      allClouds[i],
      randomBetween(2, 6) / 10,
      {
        scale: 1.2
      },
      {
        scale: 2,
        repeat: -1,
        yoyo: true,
        ease: Sine.easeOut
      }
    );

    cloudsTl.add(tl, i / 140);
  }

  cloudsTl.pause();
}

function flameFlicker() {
  rocketFlameTl = new TimelineMax(); //.timeScale(2);
  rocketFlameTl.fromTo(
    rocketFlame,
    0.1,
    {
      scale: 0.9
    },
    {
      scale: 0.7,
      repeat: -1,
      yoyo: true,
      ease: Linear.easeNone
    }
  );
}

function changeHeroMessage() {
  heroMessageCount++;
  heroMessageCount = heroMessageCount >= numHeroMessages ? 0 : heroMessageCount;
  var splitMessage = heroMessageArr[heroMessageCount].split("^");

  heroLine0.textContent = splitMessage[0];
  heroLine1.textContent = splitMessage[1];
  //console.log(splitMessage);
}

function resetAll() {
  readoutTl.timeScale(1);
  rocketFlameTl.restart(true, false);

  cloudsTl.restart(true, false);
}

function createReadoutText() {
  readoutTl
    .to(".line0", 2, {
      text: message0Str,
      ease: Linear.easeNone,
      onUpdate: function() {
        this.target[0].textContent += "_";
      },
      onComplete: function() {
        this.target[0].textContent = message0Str;
      },
      onReverseComplete: function() {
        this.target[0].textContent = "";
        this.seek(0);
      }
    })

    .to(
      ".line1",
      3,
      {
        text: message1Str,
        ease: Linear.easeNone,
        onUpdate: function() {
          this.target[0].textContent += "_";
        },
        onComplete: function() {
          this.target[0].textContent = message1Str;
        },
        onReverseComplete: function() {
          this.target[0].textContent = "";
          this.seek(0);
        }
      },
      "+=1"
    )
    .to(
      ".line2",
      3,
      {
        text: message2Str,
        ease: Linear.easeNone,
        onUpdate: function() {
          this.target[0].textContent += "_";
        },
        onComplete: function() {
          this.target[0].textContent = message2Str;
        },
        onReverseComplete: function() {
          this.target[0].textContent = "";
          this.seek(0);
        }
      },
      "+=1"
    );
}

function createMainTl() {
  mainTl
    .fromTo(
      readoutTl,
      readoutTl.duration(),
      {
        time: 0
      },
      {
        time: readoutTl.duration(),
        ease: Linear.easeNone,
        onComplete: function() {
          readoutTl.pause();
        }
      }
    )
    .to(smokeTail, 1, {
      scale: 1,
      ease: Power3.easeIn
    })
    .to(
      rocketFlameContainer,
      1,
      {
        scale: 1,
        ease: Power3.easeIn
      },
      "-=1"
    )
    .addCallback(function() {
      cloudsTl.play();
      rocketFlameTl.play();
    })

    .staggerTo(
      [cloudGroup, rocketGroup],
      10,
      {
        cycle: {
          y: ["-=1350", "-=1100"]
        },
        ease: Sine.easeIn
      },
      "+=2"
    )
    .set(
      display,
      {
        //autoAlpha:0
      },
      "-=5"
    )
    .addCallback(changeHeroMessage, "-=3")

    .staggerFromTo(
      [cloudGroup, rocketGroup],
      1,
      {
        cycle: {
          y: [cloudGroupInitPos.y + 50, rocketGroupInitPos.y + 200]
        }
      },
      {
        cycle: {
          y: [cloudGroupInitPos.y, rocketGroupInitPos.y]
        },
        immediateRender: false
      },
      0,
      "+=3"
    )
    .to([rocketFlameContainer, smokeTail], 1, {
      scale: 0
    })
    .addCallback(function() {
      readoutTl.timeScale(6);
      readoutTl.reverse();
    }, "-=5");

  mainTl.timeScale(2);
}

function launch() {
  resetAll();

  if (!mainTl.isActive()) {
    mainTl.restart();
  }
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

if (document.querySelector(".rocketFlame") !== null) {
  initMessage();
}

if (document.querySelector(".star") !== null) {
  createStars();
}

if (document.querySelector(".cloudGroup circle") !== null) {
  createClouds();
}

if (document.querySelector(".rocketFlame") !== null) {
  flameFlicker();
}

if (document.querySelector(".rocketFlame") !== null) {
  createReadoutText();
  createMainTl();
}

if (document.querySelector(".rocketSVG") !== null) {
  rocketSVG.onclick = launch;
}
