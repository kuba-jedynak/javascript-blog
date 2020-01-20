{
  'use strict';
  const titleClickHandler = function (event) {
    event.preventDefault();
    const clickedElement = this;
    //console.log('Link was clicked!');
    /* [DONE] remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');
    for (let activeLink of activeLinks) {
      activeLink.classList.remove('active');
    }
    /* [DONE] add class 'active' to the clicked link */
    clickedElement.classList.add('active');
    /* [DONE] remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.post.active');
    for (let activeArticle of activeArticles) {
      activeArticle.classList.remove('active');
    }
    /* [DONE] get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute('href');
    /* [DONE]find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector);
    /* [DONE] add class 'active' to the correct article */
    targetArticle.classList.add('active');
  };

  const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles',
    optArticleTagsSelector = '.post-tags .list',
    optArticleAuthorSelector = '.post-author',
    optTagsListSelector = '.tags .list',
    optCloudClassCount = 5,
    optCloudClassPrefix = 'tag-size-';

    

  function generateTitleLinks(customSelector = '') {
    /* remove contents of titleList */
    const titleList = document.querySelector(optTitleListSelector);
    /* for each article */
    const articles = document.querySelectorAll(optArticleSelector + customSelector);
    let html = '';
    for (let article of articles) {
      /* get the article id */
      const articleId = article.getAttribute('id');
      //console.log(articleId);
      /* find the title element */
      const articleTitle = article.querySelector(optTitleSelector).innerHTML;
      /* create HTML of the link */
      const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
      /* insert link into titleList */
      html = html + linkHTML;
    }
    titleList.innerHTML = html;
    const links = document.querySelectorAll('.titles a');
    for (let link of links) {
      link.addEventListener('click', titleClickHandler);
    }
  }
  generateTitleLinks();

  function calculateTagsParams(tags){
    const params = {
      max: 0,
      min: 999999
    };
    for(let tag in tags){
      //console.log(tag + ' is used ' + tags[tag] + ' times');
      if(tags[tag] > params.max){
        params.max = tags[tag];
      } if(tags[tag] < params.min){
        params.min = tags[tag];
      }
    }
    return params;
  }

  function calculateTagClass(count, params) {
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );
    return optCloudClassPrefix + classNumber;
  }

  function generateTags() {
    /*[NEW] create a new variable allTags with an empty object */
    let allTags = {};
    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);
    /* START LOOP: for every article: */
    for (let article of articles) {
      /* find tags wrapper */
      const tagWrapper = article.querySelector(optArticleTagsSelector);
      /* make html variable with empty string */
      let html = '';
      /* get tags from data-tags attribute */
      const articleTags = article.getAttribute('data-tags');
      /* split tags into array */
      const articleTagsArray = articleTags.split(' ');
      //console.log(articleTagsArray);
      /* START LOOP: for each tag */
      for (let tag of articleTagsArray) {
        /* generate HTML of the link */
        const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + ',</a></li> ';
        /* add generated code to html variable */
        html = html + linkHTML;
        /* [NEW] check if this link is NOT already in allTags */
        //if(!allTags.hasOwnProperty(tag))
        if(!Object.prototype.hasOwnProperty.call(allTags, tag)){
          /* [NEW] add tag to allTags object */
          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }
      }
      /* END LOOP: for each tag */
      /* insert HTML of all the links into the tags wrapper */
      tagWrapper.innerHTML = html;
      /* END LOOP: for every article: */
    }
    /* [NEW] find list of tags in right column */
    const tagList = document.querySelector(' .tags');
    const tagsParams = calculateTagsParams(allTags);
    //console.log('tagsParams:', tagsParams);
    /* [NEW] creata variable for all links HTML code*/
    let allTagsHTML = '';
    /*[NEW] START LOOP: for each tag in allTags: */
    for(let tag in allTags){
      /*[NEW] generate code of a link and add it to AllTagsHTML */
      const tagLinkHTML = '<li><a href="#tag-' + tag + '" class="' + calculateTagClass(allTags[tag], tagsParams) + '">' + tag +  ' </a></li>';
      //console.log('tagLinkHTML:', tagLinkHTML);
      allTagsHTML += tagLinkHTML;
    }
    /*[NEW] END LOOP: for each tag in allTags */
    /*[NEW] add html from allTagsHTML to tagList */
    tagList.innerHTML = allTagsHTML;
    //console.log(allTagsHTML);
  }
  generateTags();

  function tagClickHandler(event) {
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');
    /* find all tag links with class active */
    const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
    /* START LOOP: for each active tag link */
    for (let activeTag of activeTagLinks) {

      /* remove class active */
      activeTag.classList.remove('active');
      /* END LOOP: for each active tag link */
    }
    /* find all tag links with "href" attribute equal to the "href" constant */
    const tagLinks = document.querySelectorAll('a[href="' + href + '"]');
    /* START LOOP: for each found tag link */
    for (let tagLink of tagLinks) {
      /* add class active */
      tagLink.classList.add('active');
      /* END LOOP: for each found tag link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
  }

  function addClickListenersToTags() {
    /* find all links to tags */
    const links = document.querySelectorAll('.post-tags li a, .list.tags a');

    /* START LOOP: for each link */
    for (let link of links) {
      /* add tagClickHandler as event listener for that link */
      link.addEventListener('click', tagClickHandler);
      /* END LOOP: for each link */
    }
  }
  addClickListenersToTags();

  function calculateAuthorsParams(authors){
    const params = {
      max: 0,
      min: 999999
    };
    for(let author in authors){
      if(authors[author] > params.max){
        params.max = authors[author];
      } if(authors[author] < params.min){
        params.min = authors[author];
      }
    }
    //console.log(params);
    return params;
  }

  function generateAuthors() {
    let allAuthors ={};
    const articles = document.querySelectorAll(optArticleSelector);
    for (let article of articles) {
      const articleAuthor = article.querySelector(optArticleAuthorSelector);
      //console.log(articleAuthor);
      const dataAuthor = article.getAttribute('data-author');
      // console.log(dataAuthor);
      const linkHTML = '<a href="#author-' + dataAuthor + '">' + dataAuthor + ' </a>';
      /* [NEW] check if this link is NOT already in allAuthors */
      if(!Object.prototype.hasOwnProperty.call(allAuthors, dataAuthor)){
        allAuthors[dataAuthor] = 1;
      } else {
        allAuthors[dataAuthor]++;
      }
      //console.log(allAuthors);
      /* [NEW] find list of authors in right column */
      const authorsList = document.querySelector('.list.authors');
      //console.log(authorsList);
      const authorsParams = calculateAuthorsParams(allAuthors);
      //console.log(authorsParams);
      /* [NEW] creata variable for all links HTML code*/
      let allAuthorsHTML = '';
      /*[NEW] START LOOP: for each tag in allAuthors: */
      for(let allAuthor in allAuthors){
        const authorLinkHTML = '<li><a href="#author-' + allAuthor + '" class="' + (allAuthors[allAuthor], authorsParams) + '">' + allAuthor +  ' </a></li>';
        console.log(authorLinkHTML);
        /*[NEW] generate code of a link and add it to AllAuthorsHTML */
        allAuthorsHTML += authorLinkHTML;
      }
      authorsList.innerHTML = allAuthorsHTML;
      
      articleAuthor.innerHTML = linkHTML;
    }
  }
  generateAuthors();

  function authorClickHandler(event) {
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    /* make a new constant "author" and extract tag from the "href" constant */
    const author = href.replace('#author-', '');
    /* find all author links with class active */
    const activeAuthorLink = document.querySelectorAll('a.active[href^="#author-"]');
    /* START LOOP: for each active tag link */
    for(let authorAuthor of activeAuthorLink){
      /* remove class active */
      authorAuthor.classList.remove('active');
      /* END LOOP: for each active tag link */
    }    /* find all author links with "href" attribute equal to the "href" constant */
    const authorLinks = document.querySelectorAll('a[href="' + author + '"]');
    /* START LOOP: for each found tag link */
    for(let authorLink of authorLinks) {
      /* add class active */
      authorLink.classList.add('active');
      /* END LOOP: for each found tag link */
    }
    //execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-author="' + author + '"]');
  }

  function addClickListenersToAuthors() {
    const links = document.querySelectorAll('.post-author a');
    /* START LOOP: for each link */
    for (let link of links) {
      /* add tagClickHandler as event listener for that link */
      link.addEventListener('click', authorClickHandler);
      /* END LOOP: for each link */
    }
  }
  addClickListenersToAuthors();

  
}
