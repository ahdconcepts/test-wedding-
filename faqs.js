<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Wedding Website</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">

  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="faqs.css">
</head>
<body>
 <div class="faq-container">
  <div class="back-button-container">
  <a href="index.html" class="back-button">← Back to Home</a>
</div>
    <h1>Frequently Asked Questions</h1>

    <div class="faq-item">
      <button class="faq-question">
        <span class="icon">+</span>
        Gwapa si Palangging?
      </button>
      <div class="faq-answer">
        Yes, si palangging ang pinakagwapa sa tanan nya bootan pajud.
      </div>
    </div>

    <div class="faq-item">
      <button class="faq-question">
        <span class="icon">+</span>
        Sexy si Palangging?
      </button>
      <div class="faq-answer">
        Syempre. Sexy kaayo murag pang model ang lawas. lami kaayo i-hug.
      </div>
    </div>

    <div class="faq-item">
      <button class="faq-question">
        <span class="icon">+</span>
        Love nimo si Palangging?
      </button>
      <div class="faq-answer">
        Yes ofcourse! Love kaayo nako si Palangging. Siya ang akong kalipay ug inspirasyon sa kinabuhi.
      </div>
    </div>

    <div class="faq-item">
      <button class="faq-question">
        <span class="icon">+</span>
        Ready naka pakaslan si Palangging?
      </button>
      <div class="faq-answer">
        Yes, ready na kaayo ko pakaslan si Palangging. Wala nay lain nga akong gusto kundi siya ra.
      </div>
    </div>
    <div class="faq-item">
      <button class="faq-question">
        <span class="icon">+</span>
        Pila kabook inyong gusto nga anak puhon?
      </button>
      <div class="faq-answer">
        Gusto namo nga puhon, unta makab-ot namo ang lima ka anak. Pero depende ra pud sa plano ni Lord.
      </div>
      </div>
      <div class="faq-item">
      <button class="faq-question">
        <span class="icon">+</span>
        excited naka mouli para makakita ni palangging?
      </button>
      <div class="faq-answer">
        Yes, excited na kaayo ko mouli para makakita ni Palangging. Wala nay lain nga akong gusto kundi siya ra. banatan ni nako siyag maayo hehe.  
      </div>


  </div>

  <script>
    document.querySelectorAll('.faq-question').forEach(button => {
      button.addEventListener('click', () => {
        const answer = button.nextElementSibling;
        const icon = button.querySelector('.icon');

        if (answer.classList.contains('active')) {
          answer.classList.remove('active');
          icon.textContent = '+';
        } else {
          answer.classList.add('active');
          icon.textContent = '-';
        }
      });
    });
  </script>

</body>
</html>