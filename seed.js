const db = require('./models');

const categories_list= [
  {'name': 'community', 'description': 'displays listings for community activities'},
  {'name': 'lost and found', 'description': 'displays various types of lost and found postings'},
  {'name': 'news', 'description': 'displays various types of news'},
  {'name': 'services', 'description': 'displays various types of services'},
  {'name': 'housing', 'description': 'displays various listings for house rental and sale'},
  {'name': 'for sale', 'description': 'displays various postings for items for sale'},
  {'name': 'jobs', 'description': 'displays various types of jobs listings'},
  {'name': 'gigs', 'description': 'displays performance gigs related listings'},
];

const users_list= [
  {'username': 'AboveGlace', 
   'email': 'ag@aaa.com',
   'password': 'password',
   'location': 'San Francisco',
   'join_date': '2018-11-14',
   'img_url': '',
   'preference': ['community','services','housing'],
  },
  {'username': 'bootancyte49', 
   'email': 'bootancyte@aaa.com',
   'password': 'password',
   'location': 'San Jose',
   'join_date': '2018-11-16',
   'img_url': '',
   'preference': ['for sale','jobs'],
  },
  {'username': 'techarto76', 
   'email': 'techar@aaa.com',
   'password': 'password',
   'location': 'San Bruno',
   'join_date': '2018-11-13',
   'img_url': '',
   'preference': ['gigs','services','community'],
  },
  {'username': 'SlayrMurphy',
   'email': 'slmy@aaa.com',
   'password': 'password', 
   'location': 'San Mateo',
   'join_date': '2018-11-21',
   'img_url': '',
   'preference': ['for sale'],
  },
  {'username': 'gatoningli7', 
   'email': 'gat@aaa.com',
   'password': 'password',
   'location': 'Oakland',
   'join_date': '2018-11-17',
   'img_url': '',
   'preference': ['community','jobs'],
  },
];

const posts_list= [
  {'title': '17" (M) Marin Stinson 24 spd hybrid City bike w upgrades - $220',
   'post_by': 'gatoningli7',
   'categories': ['for sale'],
   'date_of_post': '2018-11-19',
   'description': 
     `This is a light weight aluminum comforter/City bike that will fit Medium to Large riders.\n
      It is clean, tuned and ready to roll with lots of upgrades.\n
      Full fenders front and back\n
      Rear rack to carry home the Pizza!\n
      Ergonomic gel saddle\n
      Security cable on the saddle to deter theft\n
      Newer Continental tires deter flats, and are fast on the road and can handle dirt fire roads too.\n
      Snappy V brakes will stop ya fast with new pads\n
      Crisp shifting Shimano trigger shifters\n
      Adjustable rise and reach stem for a dialed in fit.\n
      I also have accessories additionally available including a helmet and a new U lock, new LED lights, etc...`,
   'contact_info': 'phone: (415) 888-8088',
   'images': [
     'https://images.craigslist.org/00q0q_2TMZ383oRM7_600x450.jpg',
     'https://images.craigslist.org/00V0V_5h7sW5C8JV0_600x450.jpg'
    ],
  },
  {'title': 'Two Parsons dining chairs - $100',
   'post_by': 'gatoningli7',
   'categories': ['for sale','community'],
   'date_of_post': '2018-11-19',
   'description': 
     `Pair of off-white linen weave Parsons dining chairs. Barely used.\n
     39" x 20" x 18"\n
     Pick up only. `,
   'contact_info': 'phone: (415) 888-8088',
   'images': ['https://images.craigslist.org/00101_fx9jUfCaAxv_600x450.jpg'],
  },
  {'title': ' $1800 / 1br - 794ft2 - FULLY EQUIPPED KITCHEN with dishes and glassware',
   'post_by': 'SlayrMurphy',
   'categories': ['housing','for sale'],
   'date_of_post': '2018-11-20',
   'description': 
     `Light and bright one bedroom one bath condo with partial views of Sausalito's famous houseboats, mountains, and the Bay.\n 
     Conveniently located to San Francisco (SF), easy commute.\n
     Condo comes with FULLY EQUIPPED KITCHEN with dishes and glassware, and towels and bedding, etc.
     `,
   'contact_info': 'SlayrMurphy@aaa.com',
   'images': [
     'https://images.craigslist.org/00u0u_iWvWoHvRlaE_600x450.jpg',
     'https://images.craigslist.org/00v0v_ewGqCG5Zd8E_600x450.jpg',
     'https://images.craigslist.org/00u0u_f2D7s38NXxw_600x450.jpg',
    ],
  },
  {'title': 'Lost Cat in Felton (Plateau Dr. btw Redwood & Laurel)',
   'post_by': 'techarto76',
   'categories': ['community','lost and found'],
   'date_of_post': '2018-11-21',
   'description': 
     `Missing 13 yo female cat small 6 lbs. tabby and manx w/ 2" tail brown/white/stripes and swirls w/ beautiful eyes. Missing from Plateau btw Redwood & Laurel. AVID microchip #086599064. Reward $300 Felton Neighborhood.
     `,
   'contact_info': 'email: techarto76@aaa.com, Call (831) 566-1325',
   'images': ['https://images.craigslist.org/00606_9Kts66cjXvN_600x450.jpg',],
  },
  {'title': 'Gym Memberships now available at Bodyworks Private Fitness Studio!',
   'post_by': 'bootancyte49',
   'categories': ['community','news'],
   'date_of_post': '2018-11-30',
   'description': 
     `Limited gym memberships available. A membership at Bodyworks is like having your own private neighborhood gym! Bodyworks members have their own key access to the facility 5am to midnight on weekends and 5am to 8am and 4pm to midnight on weekdays.\n
     You can enter and exit whenever you want during those times!
     Call or email for more information!!
     `,
   'contact_info': 'website: www.scbodyworks.com',
   'images': [
     'https://images.craigslist.org/00f0f_6no5AdLLBUc_600x450.jpg',
     'https://images.craigslist.org/00x0x_7oXRmhzQyma_600x450.jpg',
    ],
  },
  {'title': 'mobile mechanic',
   'post_by': 'AboveGlace',
   'categories': ['services'],
   'date_of_post': '2018-11-28',
   'description': 
     `MOBILE MECHANIC

     *shocks/struts *audio
     *brakes *window regulator
     *tune ups *oil change
     *engine diag *lights
     *maintenance * fluids
     *belts *inspection
     *hoses * 2nd opinion
     *starters *fuel pumps
     *alternator *water pumps
     
     ASE CERTIFIED
     LOWEST PRICES IN AREA
     ALL WORK GUARANTEED
     RECEIPTS GIVEN
     AVAILABLE 7 DAYS PER WEEK
     `,
   'contact_info': `phone: 510 316 3365, facebook: Ra'kem Hephestoce El, IG : @thepeoplesauto, Snapchat: kemra7'`,
   'images': ['https://images.craigslist.org/00z0z_ijkrekbSd0t_600x450.jpg'],
  },
  {'title': 'z3 / e30 3.15 torsen diff - $350',
   'post_by': 'AboveGlace',
   'categories': ['services','for sale'],
   'date_of_post': '2018-11-29',
   'description': 
     `Z3 torsen diff. Fresh OEM bushing. Doesn't have the s315 tag but internal part numbers match realOEM part numbers for the z3.Bought this to use in my e30 but sold my e30 before installing 
     `,
   'contact_info': ``,
   'images': [
     'https://images.craigslist.org/00J0J_zPCiuBt9Tk_600x450.jpg',
     'https://images.craigslist.org/00d0d_1mFLUeIaPdF_600x450.jpg',
    ],
  },
  {'title': 'Lego 76023 UCS Batman Tumbler Retired New in box - $300',
  'post_by': 'AboveGlace',
  'categories': ['for sale'],
  'date_of_post': '2018-11-28',
  'description': 
    `Lego 76023 UCS Batman Tumbler Retired New in box

    Free Batman Lego Comic Book!
    
    Retired, new sealed in box.

    txt me if interested. 
    `,
  'contact_info': `408.585.94three0 `,
  'images': ['https://images.craigslist.org/00808_7kFY71RnTv0_600x450.jpg'],
 },
];


db.Category.deleteMany({}, (err,categories)=> {
  db.Category.create(categories_list,(err,categories)=> {
    if (err) { return console.log(err); }
    console.log('recreated all', categories.length,'categories');
  });
});
///*
db.User.deleteMany({}, (err,users)=> {
  if (err) { return console.log(err); }
  users_list.forEach((user)=> {
    var newUser= new db.User({
      'username': user.username,
      'email': user.email,
      'password': user.password,
      'location': user.location,
      'join_date': user.join_date,
      'img_url': user.img_url,
      'preference': [],
    });
    newUser.save((err,savedUser)=> {
      if (err) { return console.log(err); }
      console.log('saved user',savedUser.username);
    });
    user.preference.forEach((pref)=> {
      db.Category.findOne({'name': pref},(err1,foundCat)=> {
        if (err1) { return console.log(err1); }
        db.User.updateOne(
          {'_id': newUser._id},
          {'$push': {'preference': foundCat}},
          (err,pushedCat)=> {
            if (err) { return console.log(err); }
            console.log('saved preference',foundCat.name);
        });
      });
    });
  });

  db.Post.deleteMany({}, (err,posts)=> {
    if (err) { return console.log(err); }
    posts_list.forEach((p)=> {
      var newPost= new db.Post({
        'title': p.title,
        'date_of_post': p.date_of_post,
        'description': p.description,
        'images': p.images,
        'categories': [],
        'post_by': '',
        'contact_info': p.contact_info
      });
      db.User.findOne({'username': p.post_by})
      .exec((err,foundUser)=> {
        if (err) { return console.log(err); }
        
        newPost.post_by= foundUser;
        newPost.save((err,savedPost)=> {
          if (err) { return console.log(err); }
          console.log('saved post',savedPost.title);
          p.categories.forEach((cat)=> {
            db.Category.findOne({'name': cat})
            .exec((err1,foundCat)=> {
              if (err1) { return console.log(err1); }
              db.Post.updateOne(
                {'_id': newPost._id},
                {'$push': {'categories': foundCat}},
                (err,pushedCat)=> {
                  if (err) { return console.log(err); }
                  console.log('saved category',foundCat.name);
              });
            });
          });
        });
      });
      
    });
  });
});
