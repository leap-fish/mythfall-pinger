<script>
// @ts-nocheck

	import { mdiBell, mdiBellOff } from '@mdi/js';
    import Icon from 'mdi-svelte';

    export let enabled = false
    export let iconEnabled = mdiBell
    export let iconDisabled = mdiBellOff
</script>

<button on:click class="icon-switch">
    <span class:enable={!enabled}>
        <div class="icon">
            <Icon path={iconDisabled} />
        </div>
    </span>
    <span class:enable={enabled}>
        <div class="icon">
            <Icon path={iconEnabled} />
        </div>
    </span>
</button>

<style lang="scss">
    button {
        padding: 0;
        border: none;
        background-color: unset;
        
        display: flex;
        flex-direction: row;
        gap: 0;
        cursor: pointer;
        
        transition: all 0.2s;
        
        & > span {
            width: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: all 0.2s;
            --radius: 0.75rem;

            &:last-child {
                border-top-right-radius: var(--radius);
                border-bottom-right-radius: var(--radius);

                border-top: var(--border);
                border-bottom: var(--border);
                border-right: var(--border);
            }
            &:first-child {
                border-top-left-radius: var(--radius);
                border-bottom-left-radius: var(--radius);

                border-top: var(--border);
                border-bottom: var(--border);
                border-left: var(--border);
            }

            margin: 0;
            padding: .5rem 1.5rem;
            color: var(--gray);
            background-color: var(--bg-600);
        }
        
        & > .enable {
            color: white;

            &:first-child {
                background-color: var(--red);
            }
            &:last-child {
                background-color: var(--green);
            }
        }
    }

</style>