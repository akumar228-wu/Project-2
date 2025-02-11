Vue.component('card-item', {
    props: ['li'],
    template: `
      <li class="card-item">
        <img :src="li.image_url" :alt="li.dish_name">
        <span class='name'>{{ li.dish_name }}</span>
        <span class='description'>{{ li.description }}</span>
        <button @click="addToCart">
          <span>Add to Cart</span>
        </button>
      </li>
    `,
    methods: {
      addToCart() {
        
        console.log('Added to cart:', this.li.dish_name);
      }
    }
  });


const app = new Vue({
    el:'#vue',
    data:{
        plan:'gold',
        lis:[
        {'dish_name':'Pasta','description':'Healthy Pasta','image_url':'https://upload.wikimedia.org/wikipedia/commons/f/f0/Spaghetti_aglio%2C_olio_e_peperoncino_%2816284859030%29.jpg'},
        {'dish_name':'Red Crab','description':'Fresh from Alaska','image_url':'https://upload.wikimedia.org/wikipedia/commons/6/6a/Jacques_Lameloise%2C_escab%C3%A8che_d%27%C3%A9crevisses_sur_gaspacho_d%27asperge_et_cresson.jpg'},
        {'dish_name':'Breakfast Special','description':'Good for the soul','image_url':'https://upload.wikimedia.org/wikipedia/commons/0/02/Breakfast_at_Irving_Street_Kitchen.jpg'},
        {'dish_name':'Sea Shells Mix','description':'For the shell lovers','image_url':'https://upload.wikimedia.org/wikipedia/commons/4/4b/Seafood_linguine.jpg'},
        {'dish_name':'Ultimate Kebab','description':'The best from Middle East','image_url':'https://upload.wikimedia.org/wikipedia/commons/a/a5/Various_kebab.jpg'},
        {'dish_name':'Chicken Steak','description':'Grilled to perfection','image_url':'https://upload.wikimedia.org/wikipedia/commons/d/d9/Chicken_steak_with_pepper_sauce.jpg'},
        {'dish_name':'Filet Mignon','description':'Juicy steak served with potatoes au grantin','image_url':'https://upload.wikimedia.org/wikipedia/commons/1/1a/.Filet_mignon_et_foie_gras_au_muscat_de_Beaumes-de-Venise%2C_Pastis_Bistro%2C_Palo_Alto.jpg'},
        {'dish_name':'Bistro Brunch','description':'A touch of Australia','image_url':'https://upload.wikimedia.org/wikipedia/commons/4/48/Dishes_at_Bistro_C%2C_Hastings_Street%2C_Noosa_Heads%2C_Queensland_02.jpg'},
        {'dish_name':'California Crepe','description':'Stuffed with grilled shrimp','image_url':'https://upload.wikimedia.org/wikipedia/commons/3/32/2011-04-09_17.02.43%2C_Whispers_Cafe_and_Creperie%2C_Belmont%2C_CA_%285982715933%29.jpg'},
        {'dish_name':'Top Burger','description':'The tallest hamberger from Peru','image_url':'https://upload.wikimedia.org/wikipedia/commons/d/d4/Hamburguesa_de_carne.jpg'},
        {'dish_name':'Chicken Garlic Pizza','description':'Our specialty pizza','image_url':'https://upload.wikimedia.org/wikipedia/commons/3/33/Round_Table_chicken_%26_garlic_pizza.JPG'},
        {'dish_name':'Wok away healthy','description':'Healthy blend of noodles and vegies','image_url':'https://upload.wikimedia.org/wikipedia/commons/d/d2/Stir_Fry_Wok_-_Free_For_Commercial_Use_-_FFCU_%2827159057131%29.jpg'}
        ]
    }
})