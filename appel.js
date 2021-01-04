const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
require('dotenv').config({path: __dirname+'/.env'});

const transporter = nodemailer.createTransport({
	host: "mail.mines-ales.org",
	port: 587,
	secure: false,
	auth: {
		user: process.env.IDENTIFIANT,
		pass: process.env.PASSWORD
	}
});

const mailOptions = {
	from: process.env.IDENTIFIANT+'@mines-ales.org',
	to: process.env.IDENTIFIANT+'@mines-ales.org',
	subject: 'Appel effectué',
	text: 'Vous avez été marqué présent au cours.',
    attachments: [
        {
            path: 'prenom.png',
        }
    ]
};


async function sendMail(isAppelFailed){
    return new Promise((resolve, reject) => {
            if(isAppelFailed) {
                mailOptions.priority = 'high';
                mailOptions.subject = 'Appel échoué';
            }
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log("Impossible d'envoyer l'email, erreur : "+error);
                    resolve(false); // or use reject(false) but then you will have to handle errors
                }
                else {
                    console.log('Email envoyé : ' + info.response);
                    resolve(true);
                }
            })
    })
};



(async () => {
    const browser = await puppeteer.launch({
        //Comment optional line if you DON'T use custom path (I added this line to use it on my Raspberry with my own chromium-browser)
        executablePath: '/usr/bin/chromium-browser',
        headless: true,
        //height à 2500 pour voir toutes la semaine sur la page de présence
        defaultViewport: { height: 2500, width: 1920 },
        args: ['--no-sandbox','--disable-extensions']
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.goto('https://campus2.mines-ales.fr/');

    /*
    * Connexion à campus
    */

    await page.type('#login_username', process.env.IDENTIFIANT);
    await page.type('#login_password', process.env.PASSWORD);

    console.log("---------- Début de l'appel -----------");
    console.log(`identifiant : ${process.env.IDENTIFIANT}`);
    console.log("---------------------------------------");

    await Promise.all([
        page.waitForNavigation(), // The promise resolves after navigation has finished
        page.click('input.btn') // Clicking the link will indirectly cause a navigation
    ]);

    /*
    * Accès à la page des présences de la semaine
    */

    await Promise.all([
        page.waitForNavigation(), // The promise resolves after navigation has finished
        // lien de la page de présence
        // à changer selon la semaine
        page.goto(process.env.LIEN_VERS_LA_PAGE_DE_PRESENCE_DE_LA_SEMAINE)
    ]);

    //pour voir si on est connecté je check si la page a une balise h1
    //parce que la page de présence en a une mais pas celle de login
    var checkConnected = await page.$("h1");
    if(checkConnected) {
        console.log("Login success");
        let presenceWeek = await page.$eval("li.breadcrumb-item:nth-child(5) > a:nth-child(1)", (element) => {
            return element.innerHTML
        });
        console.log(`Page de présence à remplir atteinte : ${presenceWeek}`);
    } else {
        await page.screenshot({path: 'prenom.png'});
        await browser.close();
        mailOptions.text = "Le bot n'a pas réussi à se connecter à votre compte";
        await sendMail(true);
        console.log("---------------------------------------");
        console.log('Login failed');
        console.log(`mdp utilisé : ${process.env.PASSWORD}`);
        process.exit(-1);
    }

    /* Accès au formulaire de présence */

    const linkHandlers = await page.$x("//a[contains(text(), 'Envoyer le statut de présence')]");

    if (linkHandlers.length > 0) {
        await Promise.all([
            page.waitForNavigation(), // The promise resolves after navigation has finished
            await linkHandlers[0].click()
        ]);
        console.log("Formulaire de présence trouvé")
    } else {
        await page.screenshot({path: 'prenom.png'});
        await browser.close();
        mailOptions.text = "Le lien 'Envoyer le statut de présence' n'a pas été trouvé. L'appel n'était peut-être pas ouvert."
        await sendMail(true);
        console.log("---------------------------------------");
        console.log('Lien "Envoyer le statut de présence" non trouvé');
        process.exit(-1);
    }

    /*
    * Clic sur Présent et appui sur le bouton enregistrer
    */

    const btnPresent = await page.$x("//span[contains(text(), 'Présent')]");

    if (btnPresent.length > 0) {
        await btnPresent[0].click()
    } else {
        await page.screenshot({path: 'prenom.png'});
        await browser.close();
        mailOptions.text = "Le bouton 'Présent' n'a pas été trouvé sur le formulaire de présence."
        await sendMail(true);
        console.log("---------------------------------------");
        console.log('Bouton "Présent" introuvable');
        process.exit(-1);
    }

    await Promise.all([
        page.waitForNavigation(), // The promise resolves after navigation has finished
        page.click('input.btn') // Clicking the link will indirectly cause a navigation
    ]);

    /*
    * Fin de l'appel
     */

    console.log("---------- Appel effectué ! -----------");
    console.log("voir prenom.png pour confirmation");
    await page.screenshot({path: 'prenom.png'});
    await browser.close();

    await sendMail(false);
})();
