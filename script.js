window.addEventListener('load', () => {
  const elmColors = document.getElementsByName('change');

  for (const element of elmColors) {
    element.onclick = () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: enable,
          args: [''],
        });
      });
    };
  }

  function enable() {
    console.log('Window loaded');

    function displayNone(element) {
      element.style.display = 'none';
    }

    function width100(element) {
      element.style.width = '100%';
    }

    // wait until passed selector is finished loading
    function waitForElement(selector) {
      return new Promise((res) => {
        const element = document.querySelector(selector);

        // if selector is available, return the html element
        if (element) {
          res(element);
          return;
        }

        // if selector is not available, create an observer instance
        const observer = new MutationObserver((mutation) => {
          const targetElement = document.querySelector(selector);

          if (targetElement) {
            res(targetElement);
            observer.disconnect();
          }
        });

        // start observing the target node
        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });
      });
    }

    waitForElement('.container')
      .then((container) => {
        const leftSideBar = container.querySelector('#left-sidebar');
        const content = container.querySelector('#content');
        const innerContent = content.querySelector('.inner-content');
        const mainBar = innerContent.querySelector('#mainbar');
        const sideBar = innerContent.querySelector('#sidebar');

        setTimeout(() => {
          displayNone(leftSideBar);
          width100(content);
          width100(mainBar);
          displayNone(sideBar);


        }, 1000);
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  }
});
